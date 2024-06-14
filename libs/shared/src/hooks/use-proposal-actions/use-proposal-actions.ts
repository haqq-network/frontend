'use client';
import { useCallback } from 'react';
import { createMsgDeposit, createMsgVote } from '@evmos/proto';
import { createTxMsgVote, createTxMsgDeposit } from '@evmos/transactions';
import type { MessageMsgDepositParams } from '@evmos/transactions';
import { usePostHog } from 'posthog-js/react';
import { formatUnits } from 'viem';
import { useAccount, useChains } from 'wagmi';
import { BroadcastTxResponse, getChainParams } from '@haqq/data-access-cosmos';
import { mapToCosmosChain } from '@haqq/data-access-cosmos';
import { EstimatedFeeResponse } from '@haqq/data-access-falconer';
import { useCosmosService } from '../../providers/cosmos-provider';
import { useWallet } from '../../providers/wallet-provider';
import { getAmountIncludeFee } from '../../utils/get-amount-include-fee';
import { trackBroadcastTx } from '../../utils/track-broadcast-tx';
import { useAddress } from '../use-address/use-address';

interface ProposalActionsHook {
  vote: (
    proposalId: number,
    option: number,
    memo?: string,
    estimatedFee?: EstimatedFeeResponse,
  ) => Promise<BroadcastTxResponse>;
  deposit: (
    proposalId: number,
    amount: number,
    balance?: number,
    memo?: string,
    estimatedFee?: EstimatedFeeResponse,
  ) => Promise<BroadcastTxResponse>;
  getVoteEstimatedFee: (
    proposalId: number,
    option: number,
  ) => Promise<EstimatedFeeResponse>;
  getDepositEstimatedFee: (
    proposalId: number,
    amount: number,
  ) => Promise<EstimatedFeeResponse>;
}

export function useProposalActions(): ProposalActionsHook {
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

  const handleVote = useCallback(
    async (
      proposalId: number,
      option: number,
      memo = '',
      estimatedFee?: EstimatedFeeResponse,
    ) => {
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);

      if (sender && haqqChain) {
        const fee = getFee(estimatedFee);
        const voteParams = {
          proposalId,
          option,
        };
        const msg = createTxMsgVote(haqqChain, sender, fee, memo, voteParams);
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

  const handleDeposit = useCallback(
    async (
      proposalId: number,
      amount: number,
      balance?: number,
      memo = '',
      estimatedFee?: EstimatedFeeResponse,
    ) => {
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);

      if (sender && haqqChain) {
        const fee = getFee(estimatedFee);
        const depositParams: MessageMsgDepositParams = {
          proposalId,
          deposit: getAmountIncludeFee(amount, balance ?? 0, fee),
        };
        const msg = createTxMsgDeposit(
          haqqChain,
          sender,
          fee,
          memo,
          depositParams,
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

  const handleVoteEstimatedFee = useCallback(
    async (proposalId: number, option: number) => {
      const pubkey = await getPubkey(ethAddress as string);
      const protoMsg = createMsgVote(proposalId, option, haqqAddress as string);
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

  const handleDepositEstimatedFee = useCallback(
    async (proposalId: number, amount: number) => {
      const pubkey = await getPubkey(ethAddress as string);
      const protoMsg = createMsgDeposit(proposalId, haqqAddress as string, {
        amount: formatUnits(BigInt(amount), 18),
        denom: 'aISLM',
      });
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
    vote: handleVote,
    deposit: handleDeposit,
    getVoteEstimatedFee: handleVoteEstimatedFee,
    getDepositEstimatedFee: handleDepositEstimatedFee,
  };
}
