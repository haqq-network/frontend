import { useCallback } from 'react';
import { createMsgDeposit, createMsgVote } from '@evmos/proto';
import {
  Sender,
  createTxMsgVote,
  createTxMsgDeposit,
  signatureToWeb3Extension,
  createTxRawEIP712,
} from '@evmos/transactions';
import type { MessageMsgDepositParams, TxGenerated } from '@evmos/transactions';
import { formatUnits } from 'viem';
import { useNetwork, useWalletClient } from 'wagmi';
import { getChainParams } from '../../chains/get-chain-params';
import { mapToCosmosChain } from '../../chains/map-to-cosmos-chain';
import {
  BroadcastTxResponse,
  useCosmosService,
} from '../../providers/cosmos-provider';
import { useSupportedChains } from '../../providers/wagmi-provider';
import { getAmountIncludeFee } from '../../utils/get-amount-include-fee';
import { EstimatedFeeResponse } from '../../utils/get-estimated-fee';
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
  const { data: walletClient } = useWalletClient();
  const {
    broadcastTransaction,
    getPubkey,
    getTransactionStatus,
    getEstimatedFee,
    getFee,
    getSender,
  } = useCosmosService();
  const chains = useSupportedChains();
  const { haqqAddress, ethAddress } = useAddress();
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
