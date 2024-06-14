'use client';
import { useCallback } from 'react';
import {
  createGenericAuthorization,
  createMsgGrant,
  createMsgRevoke,
} from '@evmos/proto';
import {
  createTxMsgGenericGrant,
  MsgGenericAuthorizationParams,
  MsgGenericRevokeParams,
  createTxMsgGenericRevoke,
} from '@evmos/transactions';
import { usePostHog } from 'posthog-js/react';
import { useAccount, useChains } from 'wagmi';
import { BroadcastTxResponse, getChainParams } from '@haqq/data-access-cosmos';
import { mapToCosmosChain } from '@haqq/data-access-cosmos';
import { EstimatedFeeResponse } from '@haqq/data-access-falconer';
import { useCosmosService } from '../../providers/cosmos-provider';
import { useWallet } from '../../providers/wallet-provider';
import { trackBroadcastTx } from '../../utils/track-broadcast-tx';
import { useAddress } from '../use-address/use-address';

interface AuthzActionsHook {
  grant: (
    grantee: string,
    msgType: string,
    expires: number,
    memo?: string,
    estimatedFee?: EstimatedFeeResponse,
  ) => Promise<BroadcastTxResponse>;
  revoke: (
    grantee: string,
    msgType: string,
    memo?: string,
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
  const {
    broadcastTransaction,
    getTransactionStatus,
    getEstimatedFee,
    getFee,
    getSender,
  } = useCosmosService();
  const { getPubkey, signTransaction } = useWallet();
  const { haqqAddress, ethAddress } = useAddress();
  const chains = useChains();
  const { chain = chains[0] } = useAccount();
  const chainParams = getChainParams(chain?.id ?? chains[0].id);
  const haqqChain = mapToCosmosChain(chainParams);
  const posthog = usePostHog();
  const chainId = chain.id;

  const handleGrant = useCallback(
    async (
      grantee: string,
      msgType: string,
      expires: number,
      memo = '',
      estimatedFee?: EstimatedFeeResponse,
    ) => {
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);

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
        const txResponse = await trackBroadcastTx(
          broadcastTransaction(rawTx),
          chainId,
          posthog,
        );

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
      chainId,
      posthog,
      getTransactionStatus,
    ],
  );

  const handleRevoke = useCallback(
    async (
      grantee: string,
      msgType: string,
      memo = '',
      estimatedFee?: EstimatedFeeResponse,
    ) => {
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);

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
        const txResponse = await trackBroadcastTx(
          broadcastTransaction(rawTx),
          chainId,
          posthog,
        );

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
      chainId,
      posthog,
      getTransactionStatus,
    ],
  );

  const handleGrantEstimatedFee = useCallback(
    async (grantee: string, msgType: string, expires: number) => {
      const pubkey = await getPubkey(ethAddress as string);
      const protoMsg = createMsgGrant(
        haqqAddress as string,
        grantee,
        createGenericAuthorization(msgType),
        expires,
      );
      const memo = '';

      return await getEstimatedFee(
        protoMsg,
        memo,
        haqqChain.cosmosChainId,
        haqqAddress as string,
        pubkey,
      );
    },
    [
      getPubkey,
      ethAddress,
      haqqAddress,
      getEstimatedFee,
      haqqChain.cosmosChainId,
    ],
  );

  const handleRevokeEstimatedFee = useCallback(
    async (grantee: string, msgType: string) => {
      const pubkey = await getPubkey(ethAddress as string);
      const protoMsg = createMsgRevoke(haqqAddress as string, grantee, msgType);
      const memo = '';

      return await getEstimatedFee(
        protoMsg,
        memo,
        haqqChain.cosmosChainId,
        haqqAddress as string,
        pubkey,
      );
    },
    [
      getPubkey,
      ethAddress,
      haqqAddress,
      getEstimatedFee,
      haqqChain.cosmosChainId,
    ],
  );

  return {
    grant: handleGrant,
    revoke: handleRevoke,
    getGrantEstimatedFee: handleGrantEstimatedFee,
    getRevokeEstimatedFee: handleRevokeEstimatedFee,
  };
}
