import { useCallback } from 'react';
import { createMsgDeposit, createMsgVote } from '@evmos/proto';
import { createTxMsgVote, createTxMsgDeposit } from '@evmos/transactions';
import type { MessageMsgDepositParams } from '@evmos/transactions';
import { formatUnits } from 'viem';
import { useNetwork } from 'wagmi';
import { BroadcastTxResponse, getChainParams } from '@haqq/data-access-cosmos';
import { mapToCosmosChain } from '@haqq/data-access-cosmos';
import { EstimatedFeeResponse } from '@haqq/data-access-falconer';
import { useCosmosService } from '../../providers/cosmos-provider';
import { useSupportedChains } from '../../providers/wagmi-provider';
import { useWallet } from '../../providers/wallet-provider';
import { getAmountIncludeFee } from '../../utils/get-amount-include-fee';
import { useAddress } from '../use-address/use-address';

interface ProposalActionsHook {
  vote: (
    proposalId: number,
    option: number,
    estimatedFee?: EstimatedFeeResponse,
  ) => Promise<BroadcastTxResponse>;
  deposit: (
    proposalId: number,
    amount: number,
    balance?: number,
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
  const chains = useSupportedChains();
  const { haqqAddress, ethAddress } = useAddress();
  const { chain = chains[0] } = useNetwork();
  const chainParams = getChainParams(chain.id);
  const haqqChain = mapToCosmosChain(chainParams);

  const handleVote = useCallback(
    async (
      proposalId: number,
      option: number,
      estimatedFee?: EstimatedFeeResponse,
    ) => {
      console.log('handleVote', { proposalId, option });
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);
      const memo = `Vote for proposal #${proposalId}`;

      if (sender && haqqChain) {
        const fee = getFee(estimatedFee);
        const voteParams = {
          proposalId,
          option,
        };
        const msg = createTxMsgVote(haqqChain, sender, fee, memo, voteParams);
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

  const handleDeposit = useCallback(
    async (
      proposalId: number,
      amount: number,
      balance?: number,
      estimatedFee?: EstimatedFeeResponse,
    ) => {
      console.log('handleDeposit', { proposalId, amount });
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);
      const memo = `Deposit to proposal #${proposalId}`;

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

  const handleVoteEstimatedFee = useCallback(
    async (proposalId: number, option: number) => {
      const pubkey = await getPubkey(ethAddress as string);
      const protoMsg = createMsgVote(proposalId, option, haqqAddress as string);
      const memo = `Vote for proposal #${proposalId}`;

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
      const memo = `Deposit to proposal #${proposalId}`;

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
