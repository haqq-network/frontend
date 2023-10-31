import { useCallback, useMemo } from 'react';
import {
  Sender,
  createTxMsgGenericGrant,
  signatureToWeb3Extension,
  createTxRawEIP712,
  TxGenerated,
  MsgGenericAuthorizationParams,
  MsgGenericRevokeParams,
  createTxMsgGenericRevoke,
} from '@evmos/transactions';
import {
  createMsgGenericAuthorization,
  createMsgRevokeGenericAuthorization,
} from '@evmos/eip712';
import { useAddress } from '../use-address/use-address';
import { getChainParams } from '../../chains/get-chain-params';
import {
  BroadcastTxResponse,
  useCosmosService,
} from '../../providers/cosmos-provider';
import { mapToCosmosChain } from '../../chains/map-to-cosmos-chain';
import { useFeeData, useNetwork, useWalletClient } from 'wagmi';

interface AuthzActionsHook {
  grant: (
    grantee: string,
    msgType: string,
    expires: number,
  ) => Promise<BroadcastTxResponse>;
  revoke: (grantee: string, msgType: string) => Promise<BroadcastTxResponse>;
}

export function useAuthzActions(): AuthzActionsHook {
  const { chain } = useNetwork();
  const { data: walletClient } = useWalletClient();
  const { broadcastTransaction, getPubkey, getFee, getSender } =
    useCosmosService();
  const { haqqAddress, ethAddress } = useAddress();
  const { data: feeData } = useFeeData({ watch: true });

  const haqqChain = useMemo(() => {
    if (!chain || chain.unsupported) {
      return undefined;
    }

    const chainParams = getChainParams(chain.id);
    return mapToCosmosChain(chainParams);
  }, [chain]);

  const signTransaction = useCallback(
    async (msg: TxGenerated, sender: Sender) => {
      if (haqqChain && ethAddress && walletClient) {
        const signature = await walletClient.request({
          method: 'eth_signTypedData_v4',
          params: [ethAddress as `0x${string}`, JSON.stringify(msg.eipToSign)],
        });
        const extension = signatureToWeb3Extension(
          haqqChain,
          sender,
          signature,
        );
        const rawTx = createTxRawEIP712(
          msg.legacyAmino.body,
          msg.legacyAmino.authInfo,
          extension,
        );

        return rawTx;
      } else {
        throw new Error('No haqqChain');
      }
    },
    [ethAddress, haqqChain, walletClient],
  );

  const handleGrant = useCallback(
    async (grantee: string, msgType: string, expires: number) => {
      console.log('handleGrant', { grantee, expires });
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);
      const memo = `Grant access to ${grantee} for "${msgType}" transactions`;

      if (sender && haqqChain && feeData) {
        const grantParams: MsgGenericAuthorizationParams = {
          botAddress: grantee,
          typeUrl: msgType,
          expires,
        };

        const fee = await getFee(
          {
            '@type': '/cosmos.authz.v1beta1.MsgGrant',
            ...createMsgGenericAuthorization(
              sender.accountAddress,
              grantParams.botAddress,
              grantParams.typeUrl,
              grantParams.expires,
            ).value,
          },
          sender,
          Number(feeData.gasPrice),
        );
        const msg = createTxMsgGenericGrant(
          haqqChain,
          sender,
          fee,
          memo,
          grantParams,
        );

        const rawTx = await signTransaction(msg, sender);
        const txResponse = await broadcastTransaction(rawTx);

        if (txResponse.code !== 0) {
          throw new Error(txResponse.raw_log);
        }

        return txResponse;
      } else {
        throw new Error('No sender');
      }
    },
    [
      broadcastTransaction,
      ethAddress,
      feeData,
      getFee,
      getPubkey,
      getSender,
      haqqAddress,
      haqqChain,
      signTransaction,
    ],
  );

  const handleRevoke = useCallback(
    async (grantee: string, msgType: string) => {
      console.log('handleRevoke', { grantee, msgType });
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);
      const memo = `Revoke access from ${grantee} for "${msgType}" transactions`;

      if (sender && haqqChain && feeData) {
        const revokeParams: MsgGenericRevokeParams = {
          botAddress: grantee,
          typeUrl: msgType,
        };

        const fee = await getFee(
          {
            '@type': '/cosmos.authz.v1beta1.MsgRevoke',
            ...createMsgRevokeGenericAuthorization(
              sender.accountAddress,
              revokeParams.botAddress,
              revokeParams.typeUrl,
            ).value,
          },
          sender,
          Number(feeData.gasPrice),
        );
        const msg = createTxMsgGenericRevoke(
          haqqChain,
          sender,
          fee,
          memo,
          revokeParams,
        );

        const rawTx = await signTransaction(msg, sender);
        const txResponse = await broadcastTransaction(rawTx);

        if (txResponse.code !== 0) {
          throw new Error(txResponse.raw_log);
        }

        return txResponse;
      } else {
        throw new Error('No sender');
      }
    },
    [
      broadcastTransaction,
      ethAddress,
      feeData,
      getFee,
      getPubkey,
      getSender,
      haqqAddress,
      haqqChain,
      signTransaction,
    ],
  );

  return {
    grant: handleGrant,
    revoke: handleRevoke,
  };
}
