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
import {
  delegateAbi,
  undelegateAbi,
  redelegateAbi,
  withdrawAllDelegatorRewardsAbi,
  withdrawDelegatorRewardAbi,
} from '../../precompile/staking-abi';
import { useCosmosService } from '../../providers/cosmos-provider';
import { useWallet } from '../../providers/wallet-provider';
import { getAmountIncludeFee } from '../../utils/get-amount-include-fee';
import { trackBroadcastTx } from '../../utils/track-broadcast-tx';
import { useAddress } from '../use-address/use-address';

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

  // Convert Ethereum transaction hash to Cosmos SDK-like response
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

  // Calculate delegation parameters including fee
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

  // Calculate redelegation parameters including fee
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

  // Handle delegation transaction
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

  // Handle precompile delegation transaction
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

  // Unified function to handle both regular and precompile delegation
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

  // Handle undelegation transaction
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

  // Handle precompile undelegation transaction
  const handlePrecompileUndelegate = useCallback(
    async (validatorAddress?: string, amount?: number) => {
      if (!validatorAddress || !amount || !ethAddress || !writeContractAsync) {
        throw new Error(
          'Insufficient data for undelegation or simulation error',
        );
      }

      const txHash = await writeContractAsync({
        address: STAKING_PRECOMPILE_ADDRESS,
        abi: undelegateAbi,
        functionName: 'undelegate',
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

  // Unified function to handle both regular and precompile undelegation
  const handleUnifiedUndelegate = useCallback(
    async (
      validatorAddress?: string,
      amount?: number,
      balance?: number,
      memo = '',
      estimatedFee?: EstimatedFeeResponse,
      usePrecompile = false,
    ) => {
      if (usePrecompile) {
        return await handlePrecompileUndelegate(validatorAddress, amount);
      } else {
        return await handleUndelegate(
          validatorAddress,
          amount,
          balance,
          memo,
          estimatedFee,
        );
      }
    },
    [handleUndelegate, handlePrecompileUndelegate],
  );

  // Handle redelegation transaction
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

  // Handle precompile redelegation transaction
  const handlePrecompileRedelegate = useCallback(
    async (
      validatorSourceAddress: string,
      validatorDestinationAddress: string,
      amount: number,
    ) => {
      if (!ethAddress || !writeContractAsync) {
        throw new Error(
          'Insufficient data for redelegation or simulation error',
        );
      }

      const txHash = await writeContractAsync({
        address: STAKING_PRECOMPILE_ADDRESS,
        abi: redelegateAbi,
        functionName: 'redelegate',
        args: [
          ethAddress,
          validatorSourceAddress,
          validatorDestinationAddress,
          BigInt(amount * 10 ** 18),
        ],
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

  // Unified function to handle both regular and precompile redelegation
  const handleUnifiedRedelegate = useCallback(
    async (
      validatorSourceAddress: string,
      validatorDestinationAddress: string,
      amount: number,
      balance?: number,
      memo = '',
      estimatedFee?: EstimatedFeeResponse,
      usePrecompile = false,
    ) => {
      if (usePrecompile) {
        return await handlePrecompileRedelegate(
          validatorSourceAddress,
          validatorDestinationAddress,
          amount,
        );
      } else {
        return await handleRedelegate(
          validatorSourceAddress,
          validatorDestinationAddress,
          amount,
          balance,
          memo,
          estimatedFee,
        );
      }
    },
    [handleRedelegate, handlePrecompileRedelegate],
  );

  // Handle claiming reward from a single validator
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

  // Handle precompile claiming reward from a single validator
  const handlePrecompileClaimReward = useCallback(
    async (validatorAddress: string) => {
      if (!ethAddress || !writeContractAsync) {
        throw new Error(
          'Insufficient data for claiming reward or simulation error',
        );
      }

      const txHash = await writeContractAsync({
        address: STAKING_PRECOMPILE_ADDRESS,
        abi: withdrawDelegatorRewardAbi,
        functionName: 'withdrawDelegatorReward',
        args: [ethAddress, validatorAddress],
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

  // Unified function to handle both regular and precompile reward claiming
  const handleUnifiedClaimReward = useCallback(
    async (
      validatorAddress: string,
      memo = '',
      estimatedFee?: EstimatedFeeResponse,
      usePrecompile = false,
    ) => {
      if (usePrecompile) {
        return await handlePrecompileClaimReward(validatorAddress);
      } else {
        return await handleClaimReward(validatorAddress, memo, estimatedFee);
      }
    },
    [handleClaimReward, handlePrecompileClaimReward],
  );

  // Handle claiming rewards from all validators
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

  // Handle precompile claiming rewards from all validators
  const handlePrecompileClaimAllRewards = useCallback(async () => {
    if (!ethAddress || !writeContractAsync) {
      throw new Error(
        'Insufficient data for claiming all rewards or simulation error',
      );
    }

    const txHash = await writeContractAsync({
      address: STAKING_PRECOMPILE_ADDRESS,
      abi: withdrawAllDelegatorRewardsAbi,
      functionName: 'withdrawAllDelegatorRewards',
      args: [ethAddress],
    });

    if (!txHash) {
      throw new Error('Transaction was not sent');
    }

    const transactionStatus = await getEvmTransactionStatus(txHash);

    if (transactionStatus === null) {
      throw new Error('Transaction not found');
    }

    return transactionStatus.tx_response;
  }, [ethAddress, writeContractAsync, getEvmTransactionStatus]);

  // Unified function to handle both regular and precompile claiming all rewards
  const handleUnifiedClaimAllRewards = useCallback(
    async (
      validatorAddresses: string[],
      memo = '',
      estimatedFee?: EstimatedFeeResponse,
      usePrecompile = false,
    ) => {
      if (usePrecompile) {
        return await handlePrecompileClaimAllRewards();
      } else {
        return await handleClaimAllRewards(
          validatorAddresses,
          memo,
          estimatedFee,
        );
      }
    },
    [handleClaimAllRewards, handlePrecompileClaimAllRewards],
  );

  // Estimate fee for delegation transaction
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

  // Estimate fee for precompile delegation transaction
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

  // Unified function to estimate fee for both regular and precompile delegation
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

  const handlePrecompileUndelegateEstimatedFee = useCallback(
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
            abi: undelegateAbi,
            functionName: 'undelegate',
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

  const handleUnifiedUndelegateEstimatedFee = useCallback(
    async (
      validatorAddress: string,
      amount: number,
      usePrecompile = false,
    ): Promise<EstimatedFeeResponse> => {
      if (usePrecompile) {
        return await handlePrecompileUndelegateEstimatedFee(
          validatorAddress,
          amount,
        );
      } else {
        return await handleUndelegateEstimatedFee(validatorAddress, amount);
      }
    },
    [handlePrecompileUndelegateEstimatedFee, handleUndelegateEstimatedFee],
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

  const handlePrecompileRedelegateEstimatedFee = useCallback(
    async (
      validatorSourceAddress: string,
      validatorDestinationAddress: string,
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
            abi: redelegateAbi,
            functionName: 'redelegate',
            args: [
              ethAddress,
              validatorSourceAddress,
              validatorDestinationAddress,
              amountInWei,
            ],
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

  const handleUnifiedRedelegateEstimatedFee = useCallback(
    async (
      validatorSourceAddress: string,
      validatorDestinationAddress: string,
      amount: number,
      usePrecompile = false,
    ): Promise<EstimatedFeeResponse> => {
      if (usePrecompile) {
        return await handlePrecompileRedelegateEstimatedFee(
          validatorSourceAddress,
          validatorDestinationAddress,
          amount,
        );
      } else {
        return await handleRedelegateEstimatedFee(
          validatorSourceAddress,
          validatorDestinationAddress,
          amount,
        );
      }
    },
    [handlePrecompileRedelegateEstimatedFee, handleRedelegateEstimatedFee],
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

  const handlePrecompileClaimRewardEstimatedFee = useCallback(
    async (validatorAddress: string): Promise<EstimatedFeeResponse> => {
      if (!ethAddress || !config) {
        throw new Error('Insufficient data for fee estimation');
      }

      try {
        const estimatedGas = await estimateGas(config, {
          to: STAKING_PRECOMPILE_ADDRESS,
          data: encodeFunctionData({
            abi: withdrawDelegatorRewardAbi,
            functionName: 'withdrawDelegatorReward',
            args: [ethAddress, validatorAddress],
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

  const handleUnifiedClaimRewardEstimatedFee = useCallback(
    async (
      validatorAddress: string,
      usePrecompile = false,
    ): Promise<EstimatedFeeResponse> => {
      if (usePrecompile) {
        return await handlePrecompileClaimRewardEstimatedFee(validatorAddress);
      } else {
        return await handleGetRewardEstimatedFee(validatorAddress);
      }
    },
    [handlePrecompileClaimRewardEstimatedFee, handleGetRewardEstimatedFee],
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

  const handlePrecompileClaimAllRewardsEstimatedFee =
    useCallback(async (): Promise<EstimatedFeeResponse> => {
      if (!ethAddress || !config) {
        throw new Error('Insufficient data for fee estimation');
      }

      try {
        const estimatedGas = await estimateGas(config, {
          to: STAKING_PRECOMPILE_ADDRESS,
          data: encodeFunctionData({
            abi: withdrawAllDelegatorRewardsAbi,
            functionName: 'withdrawAllDelegatorRewards',
            args: [ethAddress],
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
    }, [config, ethAddress]);

  const handleUnifiedClaimAllRewardsEstimatedFee = useCallback(
    async (
      validatorAddresses: string[],
      usePrecompile = false,
    ): Promise<EstimatedFeeResponse> => {
      if (usePrecompile) {
        return await handlePrecompileClaimAllRewardsEstimatedFee();
      } else {
        return await handleGetAllRewardEstimatedFee(validatorAddresses);
      }
    },
    [
      handlePrecompileClaimAllRewardsEstimatedFee,
      handleGetAllRewardEstimatedFee,
    ],
  );

  return {
    delegate: handleUnifiedDelegate,
    getDelegateEstimatedFee: handleUnifiedDelegateEstimatedFee,
    undelegate: handleUnifiedUndelegate,
    getUndelegateEstimatedFee: handleUnifiedUndelegateEstimatedFee,
    redelegate: handleUnifiedRedelegate,
    getRedelegateEstimatedFee: handleUnifiedRedelegateEstimatedFee,
    claimReward: handleUnifiedClaimReward,
    getClaimRewardEstimatedFee: handleUnifiedClaimRewardEstimatedFee,
    claimAllRewards: handleUnifiedClaimAllRewards,
    getClaimAllRewardEstimatedFee: handleUnifiedClaimAllRewardsEstimatedFee,
  };
}
