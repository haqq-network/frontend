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
import { useAddress } from '../use-address/use-address';
import { DEFAULT_FEE, getChainParams } from '../../chains/get-chain-params';
import { useCosmosService } from '../../providers/cosmos-provider';
import { mapToCosmosChain } from '../../chains/map-to-cosmos-chain';
import { useNetwork, useWalletClient } from 'wagmi';

interface AuthzActionsHook {
  grant: (grantee: string, msgType: string, expires: number) => Promise<string>;
  revoke: (grantee: string, msgType: string) => Promise<string>;
}

export function useAuthzActions(): AuthzActionsHook {
  const { chain } = useNetwork();
  const { data: walletClient } = useWalletClient();
  const { broadcastTransaction, getAccountBaseInfo, getPubkey } =
    useCosmosService();
  const { haqqAddress, ethAddress } = useAddress();

  const haqqChain = useMemo(() => {
    if (!chain || chain.unsupported) {
      return undefined;
    }

    const chainParams = getChainParams(chain.id);
    return mapToCosmosChain(chainParams);
  }, [chain]);

  const getSender = useCallback(
    async (address: string, pubkey: string) => {
      try {
        const accInfo = await getAccountBaseInfo(address);

        if (!accInfo) {
          throw new Error('no base account info');
        }

        return {
          accountAddress: address,
          sequence: parseInt(accInfo.sequence, 10),
          accountNumber: parseInt(accInfo.account_number, 10),
          pubkey,
        };
      } catch (error) {
        console.error((error as Error).message);
        throw error;
      }
    },
    [getAccountBaseInfo],
  );

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

      if (sender && haqqChain) {
        const grantParams: MsgGenericAuthorizationParams = {
          botAddress: grantee,
          typeUrl: msgType,
          expires,
        };

        const msg = createTxMsgGenericGrant(
          haqqChain,
          sender,
          DEFAULT_FEE,
          memo,
          grantParams,
        );

        const rawTx = await signTransaction(msg, sender);
        const txResponse = await broadcastTransaction(rawTx);

        return txResponse.txhash;
      } else {
        throw new Error('No sender');
      }
    },
    [
      broadcastTransaction,
      ethAddress,
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

      if (sender && haqqChain) {
        const revokeParams: MsgGenericRevokeParams = {
          botAddress: grantee,
          typeUrl: msgType,
        };

        const msg = createTxMsgGenericRevoke(
          haqqChain,
          sender,
          DEFAULT_FEE,
          memo,
          revokeParams,
        );

        const rawTx = await signTransaction(msg, sender);
        const txResponse = await broadcastTransaction(rawTx);

        return txResponse.txhash;
      } else {
        throw new Error('No sender');
      }
    },
    [
      broadcastTransaction,
      ethAddress,
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
