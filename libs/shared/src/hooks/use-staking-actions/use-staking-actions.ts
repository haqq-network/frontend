'use client';
import { useCallback } from 'react';
import {
  createMsgBeginRedelegate,
  createMsgDelegate,
  createMsgUndelegate,
  createMsgWithdrawDelegatorReward,
} from '@evmos/proto';
import {
  createTxMsgDelegate,
  createTxMsgUndelegate,
  createTxMsgWithdrawDelegatorReward,
  createTxMsgMultipleWithdrawDelegatorReward,
  createTxMsgBeginRedelegate,
  MsgBeginRedelegateParams,
} from '@evmos/transactions';
import type { Fee, MsgDelegateParams } from '@evmos/transactions';
import {
  waitForTransactionReceipt,
  getGasPrice,
  estimateGas,
} from '@wagmi/core';
import { usePostHog } from 'posthog-js/react';
import { type Hash, encodeFunctionData, parseUnits } from 'viem';
import { useAccount, useChains, useConfig, useWriteContract } from 'wagmi';
import { haqqMainnet } from 'wagmi/chains';
import { getChainParams } from '@haqq/data-access-cosmos';
import { mapToCosmosChain } from '@haqq/data-access-cosmos';
import { EstimatedFeeResponse } from '@haqq/data-access-falconer';
import { STAKING_PRECOMPILE_ADDRESS } from '../../precompile/adresses';
import { useCosmosService } from '../../providers/cosmos-provider';
import { useWallet } from '../../providers/wallet-provider';
import { getAmountIncludeFee } from '../../utils/get-amount-include-fee';
import { trackBroadcastTx } from '../../utils/track-broadcast-tx';
import { useAddress } from '../use-address/use-address';

const delegateAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'delegatorAddress',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'validatorAddress',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'delegate',
    outputs: [
      {
        internalType: 'bool',
        name: 'success',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export function useStakingActions() {
  const {
    broadcastTransaction,
    getTransactionStatus,
    getEstimatedFee,
    getFee,
    getSender,
  } = useCosmosService();
  const { haqqAddress, ethAddress } = useAddress();
  const { getPubkey, signTransaction, isNetworkSupported } = useWallet();
  const chains = useChains();
  const { chain = chains[0] } = useAccount();
  const chainParams = getChainParams(
    isNetworkSupported && chain?.id ? chain.id : haqqMainnet.id,
  );
  const haqqChain = mapToCosmosChain(chainParams);
  const posthog = usePostHog();
  const chainId = chain.id;
  const config = useConfig();
  const { writeContractAsync } = useWriteContract();

  const getEvmTransactionStatus = useCallback(
    async (hash: Hash) => {
      try {
        // Wait for the transaction to be mined
        const receipt = await waitForTransactionReceipt(config, { hash });

        // Check if the transaction was successful
        if (receipt.status === 'success') {
          return {
            tx_response: {
              txhash: hash,
              code: 0, // Assuming 0 means success
              raw_log: 'Transaction successful',
              // Add other fields as needed to match Cosmos SDK response structure
            },
          };
        } else {
          throw new Error('Transaction failed');
        }
      } catch (error) {
        console.error('Error getting EVM transaction status:', error);
        return null;
      }
    },
    [config],
  );

  const getDelegationParams = useCallback(
    (
      validatorAddress: string,
      amount: number,
      balance: number,
      fee: Fee,
    ): MsgDelegateParams => {
      const amountIncludeFee = getAmountIncludeFee(amount, balance, fee);

      return {
        validatorAddress,
        ...amountIncludeFee,
      };
    },
    [],
  );

  const getRedelegationParams = useCallback(
    (
      validatorSourceAddress: string,
      validatorDestinationAddress: string,
      amount: number,
      balance: number,
      fee: Fee,
    ): MsgBeginRedelegateParams => {
      return {
        validatorSrcAddress: validatorSourceAddress,
        validatorDstAddress: validatorDestinationAddress,
        ...getAmountIncludeFee(amount, balance, fee),
      };
    },
    [],
  );

  const handleDelegate = useCallback(
    async (
      validatorAddress?: string,
      amount?: number,
      balance?: number,
      memo = '',
      estimatedFee?: EstimatedFeeResponse,
    ) => {
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);

      if (sender && validatorAddress && haqqChain) {
        const fee = getFee(estimatedFee);
        const params = getDelegationParams(
          validatorAddress,
          amount ?? 0,
          balance ?? 0,
          fee,
        );
        const msg = createTxMsgDelegate(haqqChain, sender, fee, memo, params);

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
        throw new Error('No sender or Validator address');
      }
    },
    [
      getPubkey,
      ethAddress,
      getSender,
      haqqAddress,
      haqqChain,
      getFee,
      getDelegationParams,
      signTransaction,
      broadcastTransaction,
      chainId,
      posthog,
      getTransactionStatus,
    ],
  );

  const handlePrecompileDelegate = useCallback(
    async (validatorAddress?: string, amount?: number) => {
      if (!validatorAddress || !amount || !ethAddress || !writeContractAsync) {
        throw new Error('Insufficient data for delegation or simulation error');
      }

      const txHash = await writeContractAsync({
        address: STAKING_PRECOMPILE_ADDRESS,
        abi: delegateAbi,
        functionName: 'delegate',
        args: [ethAddress, validatorAddress, BigInt(amount * 10 ** 18)],
      });

      if (!txHash) {
        throw new Error('Transaction was not sent');
      }

      const transactionStatus = await getEvmTransactionStatus(txHash);

      if (transactionStatus === null) {
        throw new Error('Transaction not found');
      }

      return transactionStatus.tx_response;
    },
    [ethAddress, writeContractAsync, getEvmTransactionStatus],
  );

  const handleUnifiedDelegate = useCallback(
    async (
      validatorAddress?: string,
      amount?: number,
      balance?: number,
      memo = '',
      estimatedFee?: EstimatedFeeResponse,
      usePrecompile = false, // Flag to switch between delegate and precompile delegate
    ) => {
      if (usePrecompile) {
        return await handlePrecompileDelegate(validatorAddress, amount);
      } else {
        return await handleDelegate(
          validatorAddress,
          amount,
          balance,
          memo,
          estimatedFee,
        );
      }
    },
    [handleDelegate, handlePrecompileDelegate],
  );

  const handleUndelegate = useCallback(
    async (
      validatorAddress?: string,
      amount?: number,
      balance?: number,
      memo = '',
      estimatedFee?: EstimatedFeeResponse,
    ) => {
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);

      if (sender && validatorAddress && haqqChain) {
        const fee = getFee(estimatedFee);
        const params = getDelegationParams(
          validatorAddress,
          amount ?? 0,
          balance ?? 0,
          fee,
        );
        const msg = createTxMsgUndelegate(haqqChain, sender, fee, memo, params);
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
        throw new Error('No sender or Validator address');
      }
    },
    [
      getPubkey,
      ethAddress,
      getSender,
      haqqAddress,
      haqqChain,
      getFee,
      getDelegationParams,
      signTransaction,
      broadcastTransaction,
      chainId,
      posthog,
      getTransactionStatus,
    ],
  );

  const handleClaimAllRewards = useCallback(
    async (
      validatorAddresses: string[],
      memo = '',
      estimatedFee?: EstimatedFeeResponse,
    ) => {
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);

      if (sender && haqqChain) {
        const fee = getFee(estimatedFee);
        const params = {
          validatorAddresses,
        };
        const msg = createTxMsgMultipleWithdrawDelegatorReward(
          haqqChain,
          sender,
          fee,
          memo,
          params,
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

  const handleClaimReward = useCallback(
    async (
      validatorAddress: string,
      memo = '',
      estimatedFee?: EstimatedFeeResponse,
    ) => {
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);

      if (sender && haqqChain) {
        const fee = getFee(estimatedFee);
        const params = {
          validatorAddress,
        };
        const msg = createTxMsgWithdrawDelegatorReward(
          haqqChain,
          sender,
          fee,
          memo,
          params,
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

  const handleRedelegate = useCallback(
    async (
      validatorSourceAddress: string,
      validatorDestinationAddress: string,
      amount: number,
      balance?: number,
      memo = '',
      estimatedFee?: EstimatedFeeResponse,
    ) => {
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);

      if (sender && haqqChain) {
        const fee = getFee(estimatedFee);
        const params = getRedelegationParams(
          validatorSourceAddress,
          validatorDestinationAddress,
          amount ?? 0,
          balance ?? 0,
          fee,
        );
        const msg = createTxMsgBeginRedelegate(
          haqqChain,
          sender,
          fee,
          memo,
          params,
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
        throw new Error('No sender or Validator address');
      }
    },
    [
      getPubkey,
      ethAddress,
      getSender,
      haqqAddress,
      haqqChain,
      getFee,
      getRedelegationParams,
      signTransaction,
      broadcastTransaction,
      getTransactionStatus,
    ],
  );

  const handlePrecompileDelegateEstimatedFee = useCallback(
    async (
      validatorAddress: string,
      amount: number,
    ): Promise<EstimatedFeeResponse> => {
      if (!ethAddress || !config) {
        throw new Error('Insufficient data for fee estimation');
      }

      try {
        const amountInWei = parseUnits(amount.toString(), 18);

        const estimatedGas = await estimateGas(config, {
          to: STAKING_PRECOMPILE_ADDRESS,
          data: encodeFunctionData({
            abi: delegateAbi,
            functionName: 'delegate',
            args: [ethAddress, validatorAddress, amountInWei],
          }),
          account: ethAddress,
        });

        const gasPrice = await getGasPrice(config);

        const fee = estimatedGas * gasPrice;

        return {
          fee: fee.toString(),
          gas_price: gasPrice.toString(),
          gas_used: estimatedGas.toString(),
        };
      } catch (error) {
        console.error('Error estimating gas:', error);
        throw error;
      }
    },
    [config, ethAddress],
  );

  const handleDelegateEstimatedFee = useCallback(
    async (
      validatorAddress: string,
      amount: number,
    ): Promise<EstimatedFeeResponse> => {
      const pubkey = await getPubkey(ethAddress as string);
      const bigIntAmount = BigInt(Number(amount) * 10 ** 18);
      const protoMsg = createMsgDelegate(
        haqqAddress as string,
        validatorAddress,
        bigIntAmount.toString(),
        'aISLM',
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
      ethAddress,
      getEstimatedFee,
      getPubkey,
      haqqAddress,
      haqqChain.cosmosChainId,
    ],
  );

  const handleUnifiedDelegateEstimatedFee = useCallback(
    async (
      validatorAddress: string,
      amount: number,
      usePrecompile = false,
    ): Promise<EstimatedFeeResponse> => {
      if (usePrecompile) {
        return await handlePrecompileDelegateEstimatedFee(
          validatorAddress,
          amount,
        );
      } else {
        return await handleDelegateEstimatedFee(validatorAddress, amount);
      }
    },
    [handlePrecompileDelegateEstimatedFee, handleDelegateEstimatedFee],
  );

  const handleUndelegateEstimatedFee = useCallback(
    async (validatorAddress: string, amount: number) => {
      const pubkey = await getPubkey(ethAddress as string);
      const bigIntAmount = BigInt(Number(amount) * 10 ** 18);
      const protoMsg = createMsgUndelegate(
        haqqAddress as string,
        validatorAddress,
        bigIntAmount.toString(),
        'aISLM',
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
      ethAddress,
      getEstimatedFee,
      getPubkey,
      haqqAddress,
      haqqChain.cosmosChainId,
    ],
  );

  const handleRedelegateEstimatedFee = useCallback(
    async (
      validatorSourceAddress: string,
      validatorDestinationAddress: string,
      amount: number,
    ) => {
      const pubkey = await getPubkey(ethAddress as string);
      const bigIntAmount = BigInt(Number(amount) * 10 ** 18);
      const protoMsg = createMsgBeginRedelegate(
        haqqAddress as string,
        validatorSourceAddress,
        validatorDestinationAddress,
        bigIntAmount.toString(),
        'aISLM',
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
      ethAddress,
      getEstimatedFee,
      getPubkey,
      haqqAddress,
      haqqChain.cosmosChainId,
    ],
  );

  const handleGetRewardEstimatedFee = useCallback(
    async (validatorAddress: string) => {
      const pubkey = await getPubkey(ethAddress as string);
      const protoMsg = createMsgWithdrawDelegatorReward(
        haqqAddress as string,
        validatorAddress,
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
      ethAddress,
      getEstimatedFee,
      getPubkey,
      haqqAddress,
      haqqChain.cosmosChainId,
    ],
  );

  const handleGetAllRewardEstimatedFee = useCallback(
    async (validatorAddresses: string[]) => {
      const pubkey = await getPubkey(ethAddress as string);
      const protoMsgs = validatorAddresses.map((validatorAddress) => {
        return createMsgWithdrawDelegatorReward(
          haqqAddress as string,
          validatorAddress,
        );
      });
      const memo = '';

      return await getEstimatedFee(
        protoMsgs,
        memo,
        haqqChain.cosmosChainId,
        haqqAddress as string,
        pubkey,
      );
    },
    [
      ethAddress,
      getEstimatedFee,
      getPubkey,
      haqqAddress,
      haqqChain.cosmosChainId,
    ],
  );

  return {
    delegate: handleUnifiedDelegate,
    getDelegateEstimatedFee: handleUnifiedDelegateEstimatedFee,
    undelegate: handleUndelegate,
    getUndelegateEstimatedFee: handleUndelegateEstimatedFee,
    redelegate: handleRedelegate,
    getRedelegateEstimatedFee: handleRedelegateEstimatedFee,
    claimReward: handleClaimReward,
    getClaimRewardEstimatedFee: handleGetRewardEstimatedFee,
    claimAllRewards: handleClaimAllRewards,
    getClaimAllRewardEstimatedFee: handleGetAllRewardEstimatedFee,
  };
}
