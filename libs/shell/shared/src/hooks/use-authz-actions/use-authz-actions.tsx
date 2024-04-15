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
import { useNetwork } from 'wagmi';
import { BroadcastTxResponse, getChainParams } from '@haqq/data-access-cosmos';
import { mapToCosmosChain } from '@haqq/data-access-cosmos';
import { EstimatedFeeResponse } from '@haqq/data-access-falconer';
import { useCosmosService } from '../../providers/cosmos-provider';
import { useSupportedChains } from '../../providers/wagmi-provider';
import { useWallet } from '../../providers/wallet-provider';
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
  const {
    broadcastTransaction,
    getTransactionStatus,
    getEstimatedFee,
    getFee,
    getSender,
  } = useCosmosService();
  const { getPubkey, signTransaction } = useWallet();
  const { haqqAddress, ethAddress } = useAddress();
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();
  const chainParams = getChainParams(chain.id);
  const haqqChain = mapToCosmosChain(chainParams);

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
        console.log({ msg });
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
        console.log({ msg });
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
      const pubkey = await getPubkey(ethAddress as string);
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
      const memo = `Revoke access from ${grantee} for "${msgType}" transactions`;

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
