import { useCallback } from 'react';
import {
  createGenericAuthorization,
  createMsgGrant,
  createMsgRevoke,
} from '@evmos/proto';
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
import { useNetwork, useWalletClient } from 'wagmi';
import { getChainParams } from '../../chains/get-chain-params';
import { mapToCosmosChain } from '../../chains/map-to-cosmos-chain';
import {
  BroadcastTxResponse,
  useCosmosService,
} from '../../providers/cosmos-provider';
import { useSupportedChains } from '../../providers/wagmi-provider';
import { EstimatedFeeResponse } from '../../utils/get-estimated-fee';
import { useAddress } from '../use-address/use-address';

interface AuthzActionsHook {
  grant: (
    grantee: string,
    msgType: string,
    expires: number,
    estimatedFee?: EstimatedFeeResponse,
  ) => Promise<BroadcastTxResponse>;
  revoke: (
    grantee: string,
    msgType: string,
    estimatedFee?: EstimatedFeeResponse,
  ) => Promise<BroadcastTxResponse>;
  getGrantEstimatedFee: (
    grantee: string,
    msgType: string,
    expires: number,
  ) => Promise<EstimatedFeeResponse>;
  getRevokeEstimatedFee: (
    grantee: string,
    msgType: string,
  ) => Promise<EstimatedFeeResponse>;
}

export function useAuthzActions(): AuthzActionsHook {
  const { data: walletClient } = useWalletClient();
  const {
    broadcastTransaction,
    getPubkey,
    getTransactionStatus,
    getEstimatedFee,
    getFee,
    getSender,
  } = useCosmosService();
  const { haqqAddress, ethAddress } = useAddress();
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();
  const chainParams = getChainParams(chain.id);
  const haqqChain = mapToCosmosChain(chainParams);

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
    async (
      grantee: string,
      msgType: string,
      expires: number,
      estimatedFee?: EstimatedFeeResponse,
    ) => {
      console.log('handleGrant', { grantee, expires });
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);
      const memo = `Grant access to ${grantee} for "${msgType}" transactions`;

      if (sender && haqqChain) {
        const fee = getFee(estimatedFee);
        const grantParams: MsgGenericAuthorizationParams = {
          botAddress: grantee,
          typeUrl: msgType,
          expires,
        };

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

        const transactionStatus = await getTransactionStatus(txResponse.txhash);

        if (transactionStatus === null) {
          throw new Error('Transaction not found');
        }

        return transactionStatus.tx_response;
      } else {
        throw new Error('No sender');
      }
    },
    [
      getPubkey,
      ethAddress,
      getSender,
      haqqAddress,
      haqqChain,
      getFee,
      signTransaction,
      broadcastTransaction,
      getTransactionStatus,
    ],
  );

  const handleRevoke = useCallback(
    async (
      grantee: string,
      msgType: string,
      estimatedFee?: EstimatedFeeResponse,
    ) => {
      console.log('handleRevoke', { grantee, msgType });
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);
      const memo = `Revoke access from ${grantee} for "${msgType}" transactions`;

      if (sender && haqqChain) {
        const fee = getFee(estimatedFee);
        const revokeParams: MsgGenericRevokeParams = {
          botAddress: grantee,
          typeUrl: msgType,
        };

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

        const transactionStatus = await getTransactionStatus(txResponse.txhash);

        if (transactionStatus === null) {
          throw new Error('Transaction not found');
        }

        return transactionStatus.tx_response;
      } else {
        throw new Error('No sender');
      }
    },
    [
      getPubkey,
      ethAddress,
      getSender,
      haqqAddress,
      haqqChain,
      getFee,
      signTransaction,
      broadcastTransaction,
      getTransactionStatus,
    ],
  );

  const handleGrantEstimatedFee = useCallback(
    async (grantee: string, msgType: string, expires: number) => {
      const protoMsg = createMsgGrant(
        haqqAddress as string,
        grantee,
        createGenericAuthorization(msgType),
        expires,
      );
      const memo = `Grant access to ${grantee} for "${msgType}" transactions`;

      return await getEstimatedFee(
        protoMsg,
        memo,
        haqqChain.cosmosChainId,
        haqqAddress as string,
      );
    },
    [haqqAddress, getEstimatedFee, haqqChain.cosmosChainId],
  );

  const handleRevokeEstimatedFee = useCallback(
    async (grantee: string, msgType: string) => {
      const protoMsg = createMsgRevoke(haqqAddress as string, grantee, msgType);
      const memo = `Revoke access from ${grantee} for "${msgType}" transactions`;

      return await getEstimatedFee(
        protoMsg,
        memo,
        haqqChain.cosmosChainId,
        haqqAddress as string,
      );
    },
    [haqqAddress, getEstimatedFee, haqqChain.cosmosChainId],
  );

  return {
    grant: handleGrant,
    revoke: handleRevoke,
    getGrantEstimatedFee: handleGrantEstimatedFee,
    getRevokeEstimatedFee: handleRevokeEstimatedFee,
  };
}
