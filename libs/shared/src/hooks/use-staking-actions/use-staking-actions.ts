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
  type MsgBeginRedelegateParams,
} from '@evmos/transactions';
import type { Fee, MsgDelegateParams } from '@evmos/transactions';
import SafeAppsSDK, { TransactionStatus } from '@safe-global/safe-apps-sdk';
import {
  waitForTransactionReceipt,
  getGasPrice,
  estimateGas,
  readContract,
} from '@wagmi/core';
import { usePostHog } from 'posthog-js/react';
import { type Hash, encodeFunctionData, parseUnits } from 'viem';
import {
  useAccount,
  useChains,
  useConfig,
  useReadContract,
  useWriteContract,
  type Config,
} from 'wagmi';
import { haqqMainnet } from 'wagmi/chains';
import { getChainParams } from '@haqq/data-access-cosmos';
import { mapToCosmosChain } from '@haqq/data-access-cosmos';
import { EstimatedFeeResponse } from '@haqq/data-access-falconer';
import {
  DISTRIBUTION_PRECOMPILE_ADDRESS,
  STAKING_PRECOMPILE_ADDRESS,
} from '../../precompile/adresses';
import {
  delegationTotalRewardsAbi,
  withdrawAllDelegatorRewardsAbi,
  withdrawDelegatorRewardAbi,
} from '../../precompile/distribution-abi';
import {
  delegateAbi,
  undelegateAbi,
  redelegateAbi,
  approveAbi,
  stakingMessageTypes,
  allowanceAbi,
  MAX_UINT256_MINUS_ONE,
} from '../../precompile/staking-abi';
import { useCosmosService } from '../../providers/cosmos-provider';
import { useWallet } from '../../providers/wallet-provider';
import {
  getAmountIncludeFee,
  getMinBigIntAmount,
} from '../../utils/get-amount-include-fee';
import { trackBroadcastTx } from '../../utils/track-broadcast-tx';
import { useAddress } from '../use-address/use-address';
import { useConnectorType } from '../use-autoconnect/use-autoconnect';

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
  const { isSafe } = useConnectorType();

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
      amount: bigint,
      balance: bigint,
      fee: Fee,
      maxAllowedAmount?: bigint,
    ): MsgDelegateParams => {
      const amountIncludeFee = getAmountIncludeFee(
        amount,
        balance,
        fee,
        maxAllowedAmount,
      );

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
      amount: bigint,
      balance: bigint,
      fee: Fee,
      delegation: bigint,
    ): MsgBeginRedelegateParams => {
      return {
        validatorSrcAddress: validatorSourceAddress,
        validatorDstAddress: validatorDestinationAddress,
        ...getAmountIncludeFee(amount, balance, fee, delegation),
      };
    },
    [],
  );

  // Handle delegation transaction
  const handleDelegate = useCallback(
    async (
      fee: Fee,
      validatorAddress?: string,
      amount?: bigint,
      balance?: bigint,
      memo = '',
    ) => {
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);

      if (sender && validatorAddress && haqqChain) {
        const params = getDelegationParams(
          validatorAddress,
          amount ?? 0n,
          balance ?? 0n,
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
      getDelegationParams,
      signTransaction,
      broadcastTransaction,
      chainId,
      posthog,
      getTransactionStatus,
    ],
  );

  // Custom function to fetch Safe transaction status
  const fetchSafeTransactionStatus = useCallback(
    async (safeTxHash: string) => {
      if (!isSafe) {
        return null;
      }

      try {
        const sdk = new SafeAppsSDK();
        const txDetails = await sdk.txs.getBySafeTxHash(safeTxHash);

        return {
          isExecuted:
            txDetails.txStatus === TransactionStatus.AWAITING_EXECUTION ||
            txDetails.txStatus === TransactionStatus.SUCCESS,
          transactionHash: txDetails.txHash,
        };
      } catch (error) {
        console.error('Error fetching Safe transaction status:', error);
        throw error;
      }
    },
    [isSafe],
  );

  // Custom function to wait for Safe transaction execution
  const waitForTransactionExecution = useCallback(
    async (
      safeTxHash: string,
      maxAttempts = 20,
      interval = 5000,
    ): Promise<Hash | null> => {
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const status = await fetchSafeTransactionStatus(safeTxHash);

          if (status && status.isExecuted) {
            return (status.transactionHash as Hash) ?? null;
          }

          await new Promise((resolve) => {
            return setTimeout(resolve, interval);
          });
        } catch (error) {
          console.error(`Attempt ${attempt} failed:`, error);

          if (attempt === maxAttempts) {
            console.error('Max attempts reached. Transaction tracking failed.');
            return null;
          }
        }
      }

      return null;
    },
    [fetchSafeTransactionStatus],
  );

  // Handle precompile delegation transaction
  const handlePrecompileDelegate = useCallback(
    async (
      fee: Fee,
      validatorAddress?: string,
      amount?: bigint,
      balance?: bigint,
    ) => {
      if (!validatorAddress || !amount || !ethAddress || !writeContractAsync) {
        throw new Error('Insufficient data for delegation or simulation error');
      }

      const amountIncludeFee = getAmountIncludeFee(amount, balance ?? 0n, fee);

      // Create a transaction
      const txHash = await writeContractAsync({
        address: STAKING_PRECOMPILE_ADDRESS,
        abi: delegateAbi,
        functionName: 'delegate',
        args: [ethAddress, validatorAddress, amountIncludeFee.amount],
      });

      if (!txHash) {
        throw new Error('Transaction was not sent');
      }

      // Handle Safe and non-Safe transactions differently
      let transactionHash = txHash;
      if (isSafe) {
        try {
          const executedTxHash = await waitForTransactionExecution(
            txHash,
            30,
            1500,
          );

          if (!executedTxHash) {
            throw new Error('Safe transaction execution tracking failed');
          }

          transactionHash = executedTxHash as Hash;
        } catch (error) {
          console.error('Error waiting for Safe transaction execution:', error);
          throw new Error('Safe transaction was not executed');
        }
      }

      // Check the status of the blockchain transaction
      const transactionStatus = await getEvmTransactionStatus(transactionHash);

      if (transactionStatus === null) {
        throw new Error('Transaction not found');
      }

      return transactionStatus.tx_response;
    },
    [
      ethAddress,
      writeContractAsync,
      isSafe,
      getEvmTransactionStatus,
      waitForTransactionExecution,
    ],
  );

  // Unified function to handle both regular and precompile delegation
  const handleUnifiedDelegate = useCallback(
    async (
      validatorAddress?: string,
      amount?: bigint,
      balance?: bigint,
      memo = '',
      estimatedFee?: EstimatedFeeResponse,
      usePrecompile = false, // Flag to switch between delegate and precompile delegate
    ) => {
      const fee = getFee(estimatedFee);

      if (usePrecompile) {
        return handlePrecompileDelegate(fee, validatorAddress, amount, balance);
      } else {
        return handleDelegate(fee, validatorAddress, amount, balance, memo);
      }
    },
    [handleDelegate, getFee, handlePrecompileDelegate],
  );

  // Handle undelegation transaction
  const handleUndelegate = useCallback(
    async (
      fee: Fee,
      delegation: bigint,
      validatorAddress?: string,
      amount?: bigint,
      balance?: bigint,
      memo = '',
    ) => {
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);

      if (sender && validatorAddress && haqqChain) {
        const params = getDelegationParams(
          validatorAddress,
          amount ?? 0n,
          balance ?? 0n,
          fee,
          delegation,
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
    async (
      fee: Fee,
      delegation: bigint,
      validatorAddress?: string,
      amount?: bigint,
      balance?: bigint,
    ) => {
      if (!validatorAddress || !amount || !ethAddress || !writeContractAsync) {
        throw new Error(
          'Insufficient data for undelegation or simulation error',
        );
      }

      const amountInWei = getAmountIncludeFee(
        amount,
        balance ?? 0n,
        fee,
        delegation,
      );
      const txHash = await writeContractAsync({
        address: STAKING_PRECOMPILE_ADDRESS,
        abi: undelegateAbi,
        functionName: 'undelegate',
        args: [ethAddress, validatorAddress, amountInWei.amount],
      });

      if (!txHash) {
        throw new Error('Transaction was not sent');
      }

      // Handle Safe and non-Safe transactions differently
      let transactionHash = txHash;
      if (isSafe) {
        try {
          const executedTxHash = await waitForTransactionExecution(
            txHash,
            30,
            1500,
          );

          if (!executedTxHash) {
            throw new Error('Safe transaction execution tracking failed');
          }

          transactionHash = executedTxHash as Hash;
        } catch (error) {
          console.error('Error waiting for Safe transaction execution:', error);
          throw new Error('Safe transaction was not executed');
        }
      }

      // Check the status of the blockchain transaction
      const transactionStatus = await getEvmTransactionStatus(transactionHash);

      if (transactionStatus === null) {
        throw new Error('Transaction not found');
      }

      return transactionStatus.tx_response;
    },
    [
      ethAddress,
      writeContractAsync,
      isSafe,
      getEvmTransactionStatus,
      waitForTransactionExecution,
    ],
  );

  // Unified function to handle both regular and precompile undelegation
  const handleUnifiedUndelegate = useCallback(
    async (
      delegation: bigint,
      validatorAddress?: string,
      amount?: bigint,
      balance?: bigint,
      memo = '',
      estimatedFee?: EstimatedFeeResponse,
      usePrecompile = false,
    ) => {
      const fee = getFee(estimatedFee);
      if (usePrecompile) {
        return handlePrecompileUndelegate(
          fee,
          delegation,
          validatorAddress,
          amount,
          balance,
        );
      } else {
        return handleUndelegate(
          fee,
          delegation,
          validatorAddress,
          amount,
          balance,
          memo,
        );
      }
    },
    [handleUndelegate, handlePrecompileUndelegate, getFee],
  );

  // Handle redelegation transaction
  const handleRedelegate = useCallback(
    async (
      validatorSourceAddress: string,
      validatorDestinationAddress: string,
      amount: bigint,
      delegation: bigint,
      fee: Fee,
      balance?: bigint,
      memo = '',
    ) => {
      const pubkey = await getPubkey(ethAddress as string);
      const sender = await getSender(haqqAddress as string, pubkey);

      if (sender && haqqChain) {
        const params = getRedelegationParams(
          validatorSourceAddress,
          validatorDestinationAddress,
          amount ?? 0n,
          balance ?? 0n,
          fee,
          delegation,
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
      fee: Fee,
      delegation: bigint,
      amount: bigint,
      balance?: bigint,
    ) => {
      if (!ethAddress || !writeContractAsync) {
        throw new Error(
          'Insufficient data for redelegation or simulation error',
        );
      }
      const amountIncludeFee = getAmountIncludeFee(
        amount,
        balance ?? 0n,
        fee,
        delegation,
      );
      const txHash = await writeContractAsync({
        address: STAKING_PRECOMPILE_ADDRESS,
        abi: redelegateAbi,
        functionName: 'redelegate',
        args: [
          ethAddress,
          validatorSourceAddress,
          validatorDestinationAddress,
          amountIncludeFee.amount,
        ],
      });

      if (!txHash) {
        throw new Error('Transaction was not sent');
      }

      // Handle Safe and non-Safe transactions differently
      let transactionHash = txHash;
      if (isSafe) {
        try {
          const executedTxHash = await waitForTransactionExecution(
            txHash,
            30,
            1500,
          );

          if (!executedTxHash) {
            throw new Error('Safe transaction execution tracking failed');
          }

          transactionHash = executedTxHash as Hash;
        } catch (error) {
          console.error('Error waiting for Safe transaction execution:', error);
          throw new Error('Safe transaction was not executed');
        }
      }

      // Check the status of the blockchain transaction
      const transactionStatus = await getEvmTransactionStatus(transactionHash);

      if (transactionStatus === null) {
        throw new Error('Transaction not found');
      }

      return transactionStatus.tx_response;
    },
    [
      ethAddress,
      writeContractAsync,
      isSafe,
      getEvmTransactionStatus,
      waitForTransactionExecution,
    ],
  );

  // Unified function to handle both regular and precompile redelegation
  const handleUnifiedRedelegate = useCallback(
    async (
      validatorSourceAddress: string,
      validatorDestinationAddress: string,
      amount: bigint,
      delegation: bigint,
      balance?: bigint,
      memo = '',
      estimatedFee?: EstimatedFeeResponse,
      usePrecompile = false,
    ) => {
      const fee = getFee(estimatedFee);

      if (usePrecompile) {
        return handlePrecompileRedelegate(
          validatorSourceAddress,
          validatorDestinationAddress,
          fee,
          delegation,
          amount,
          balance,
        );
      } else {
        return handleRedelegate(
          validatorSourceAddress,
          validatorDestinationAddress,
          amount,
          delegation,
          fee,
          balance,
          memo,
        );
      }
    },
    [handleRedelegate, getFee, handlePrecompileRedelegate],
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
        address: DISTRIBUTION_PRECOMPILE_ADDRESS,
        abi: withdrawDelegatorRewardAbi,
        functionName: 'withdrawDelegatorRewards',
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
        return handlePrecompileClaimReward(validatorAddress);
      } else {
        return handleClaimReward(validatorAddress, memo, estimatedFee);
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
  const handlePrecompileClaimAllRewards = useCallback(
    async (maxRetrieve: number) => {
      if (!ethAddress || !writeContractAsync) {
        throw new Error(
          'Insufficient data for claiming all rewards or simulation error',
        );
      }

      const txHash = await writeContractAsync({
        address: DISTRIBUTION_PRECOMPILE_ADDRESS,
        abi: withdrawAllDelegatorRewardsAbi,
        functionName: 'claimRewards',
        args: [ethAddress, maxRetrieve],
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

  // Unified function to handle both regular and precompile claiming all rewards
  const handleUnifiedClaimAllRewards = useCallback(
    async (
      validatorAddresses: string[],
      maxRetrieve: number,
      memo = '',
      estimatedFee?: EstimatedFeeResponse,
      usePrecompile = false,
    ) => {
      if (usePrecompile) {
        return handlePrecompileClaimAllRewards(maxRetrieve);
      } else {
        return handleClaimAllRewards(validatorAddresses, memo, estimatedFee);
      }
    },
    [handleClaimAllRewards, handlePrecompileClaimAllRewards],
  );

  // Estimate fee for delegation transaction
  const handleDelegateEstimatedFee = useCallback(
    async (
      validatorAddress: string,
      amount: bigint,
      delegation: bigint,
    ): Promise<EstimatedFeeResponse> => {
      const pubkey = await getPubkey(ethAddress as string);
      const bigIntAmount = getMinBigIntAmount(amount, delegation);
      const protoMsg = createMsgDelegate(
        haqqAddress as string,
        validatorAddress,
        bigIntAmount.toString(),
        'aISLM',
      );
      const memo = '';

      return getEstimatedFee(
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
      amount: bigint,
      delegation: bigint,
    ): Promise<EstimatedFeeResponse> => {
      if (!ethAddress || !config) {
        throw new Error('Insufficient data for fee estimation');
      }

      try {
        const amountInWei = amount; // parseUnits(amount.toString(), 18);

        const estimatedGas = await estimateGas(config, {
          to: STAKING_PRECOMPILE_ADDRESS,
          data: encodeFunctionData({
            abi: delegateAbi,
            functionName: 'delegate',
            args: [
              ethAddress,
              validatorAddress,
              getMinBigIntAmount(amountInWei, delegation),
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

  // Unified function to estimate fee for both regular and precompile delegation
  const handleUnifiedDelegateEstimatedFee = useCallback(
    async (
      validatorAddress: string,
      amount: bigint,
      delegation: bigint,
      usePrecompile = false,
    ): Promise<EstimatedFeeResponse> => {
      if (usePrecompile) {
        return handlePrecompileDelegateEstimatedFee(
          validatorAddress,
          amount,
          delegation,
        );
      } else {
        return handleDelegateEstimatedFee(validatorAddress, amount, delegation);
      }
    },
    [handlePrecompileDelegateEstimatedFee, handleDelegateEstimatedFee],
  );

  // Estimate fee for undelegation transaction
  const handleUndelegateEstimatedFee = useCallback(
    async (validatorAddress: string, delegation: bigint, amount: bigint) => {
      const pubkey = await getPubkey(ethAddress as string);
      const bigIntAmount = getMinBigIntAmount(amount, delegation);
      const protoMsg = createMsgUndelegate(
        haqqAddress as string,
        validatorAddress,
        bigIntAmount.toString(),
        'aISLM',
      );
      const memo = '';

      return getEstimatedFee(
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

  // Estimate fee for precompile undelegation transaction
  const handlePrecompileUndelegateEstimatedFee = useCallback(
    async (
      validatorAddress: string,
      delegation: bigint,
      amount: bigint,
    ): Promise<EstimatedFeeResponse> => {
      if (!ethAddress || !config) {
        throw new Error('Insufficient data for fee estimation');
      }

      try {
        const amountInWei = amount; // parseUnits(amount.toString(), 18);

        console.log('amountInWei', amountInWei, delegation);
        const estimatedGas = await estimateGas(config, {
          to: STAKING_PRECOMPILE_ADDRESS,
          data: encodeFunctionData({
            abi: undelegateAbi,
            functionName: 'undelegate',
            args: [
              ethAddress,
              validatorAddress,
              getMinBigIntAmount(amountInWei, delegation),
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

  // Unified function to estimate fee for both regular and precompile undelegation
  const handleUnifiedUndelegateEstimatedFee = useCallback(
    async (
      validatorAddress: string,
      amount: bigint,
      delegation: bigint,
      usePrecompile = false,
    ): Promise<EstimatedFeeResponse> => {
      if (usePrecompile) {
        return handlePrecompileUndelegateEstimatedFee(
          validatorAddress,
          delegation,
          amount,
        );
      } else {
        return handleUndelegateEstimatedFee(
          validatorAddress,
          delegation,
          amount,
        );
      }
    },
    [handlePrecompileUndelegateEstimatedFee, handleUndelegateEstimatedFee],
  );

  // Estimate fee for redelegation transaction
  const handleRedelegateEstimatedFee = useCallback(
    async (
      validatorSourceAddress: string,
      validatorDestinationAddress: string,
      amount: bigint,
      delegation: bigint,
    ) => {
      const pubkey = await getPubkey(ethAddress as string);
      const bigIntAmount = getMinBigIntAmount(amount, delegation);

      const protoMsg = createMsgBeginRedelegate(
        haqqAddress as string,
        validatorSourceAddress,
        validatorDestinationAddress,
        bigIntAmount.toString(),
        'aISLM',
      );
      const memo = '';

      return getEstimatedFee(
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

  // Estimate fee for precompile redelegation transaction
  const handlePrecompileRedelegateEstimatedFee = useCallback(
    async (
      validatorSourceAddress: string,
      validatorDestinationAddress: string,
      amount: bigint,
      delegation: bigint,
    ): Promise<EstimatedFeeResponse> => {
      if (!ethAddress || !config) {
        throw new Error('Insufficient data for fee estimation');
      }

      try {
        const amountInWei = amount; // parseUnits(amount.toString(), 18);

        const estimatedGas = await estimateGas(config, {
          to: STAKING_PRECOMPILE_ADDRESS,
          data: encodeFunctionData({
            abi: redelegateAbi,
            functionName: 'redelegate',
            args: [
              ethAddress,
              validatorSourceAddress,
              validatorDestinationAddress,
              getMinBigIntAmount(amountInWei, delegation),
            ],
          }),
          account: ethAddress as `0x${string}`,
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

  // Unified function to estimate fee for both regular and precompile redelegation
  const handleUnifiedRedelegateEstimatedFee = useCallback(
    async (
      validatorSourceAddress: string,
      validatorDestinationAddress: string,
      amount: bigint,
      delegation: bigint,
      usePrecompile = false,
    ): Promise<EstimatedFeeResponse> => {
      if (usePrecompile) {
        return handlePrecompileRedelegateEstimatedFee(
          validatorSourceAddress,
          validatorDestinationAddress,
          amount,
          delegation,
        );
      } else {
        return handleRedelegateEstimatedFee(
          validatorSourceAddress,
          validatorDestinationAddress,
          amount,
          delegation,
        );
      }
    },
    [handlePrecompileRedelegateEstimatedFee, handleRedelegateEstimatedFee],
  );

  // Estimate fee for claiming rewards from a single validator
  const handleGetRewardEstimatedFee = useCallback(
    async (validatorAddress: string) => {
      const pubkey = await getPubkey(ethAddress as string);
      const protoMsg = createMsgWithdrawDelegatorReward(
        haqqAddress as string,
        validatorAddress,
      );
      const memo = '';

      return getEstimatedFee(
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

  // Estimate fee for precompile claiming rewards from a single validator
  const handlePrecompileClaimRewardEstimatedFee = useCallback(
    async (validatorAddress: string): Promise<EstimatedFeeResponse> => {
      if (!ethAddress || !config) {
        throw new Error('Insufficient data for fee estimation');
      }

      try {
        const encodedData = encodeFunctionData({
          abi: withdrawDelegatorRewardAbi,
          functionName: 'withdrawDelegatorRewards',
          args: [ethAddress, validatorAddress],
        });

        console.log('Encoded data:', encodedData);

        const estimatedGas = await estimateGas(config, {
          to: DISTRIBUTION_PRECOMPILE_ADDRESS,
          data: encodedData,
          account: ethAddress,
        });

        console.log('Estimated gas:', estimatedGas);

        const gasPrice = await getGasPrice(config);

        console.log('Gas price:', gasPrice);

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

  // Unified function to estimate fee for both regular and precompile claiming rewards
  const handleUnifiedClaimRewardEstimatedFee = useCallback(
    async (
      validatorAddress: string,
      usePrecompile = false,
    ): Promise<EstimatedFeeResponse> => {
      if (usePrecompile) {
        return handlePrecompileClaimRewardEstimatedFee(validatorAddress);
      } else {
        return handleGetRewardEstimatedFee(validatorAddress);
      }
    },
    [handlePrecompileClaimRewardEstimatedFee, handleGetRewardEstimatedFee],
  );

  // Estimate fee for claiming rewards from all validators
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

      return getEstimatedFee(
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

  // Estimate fee for precompile claiming rewards from all validators
  const handlePrecompileClaimAllRewardsEstimatedFee = useCallback(
    async (maxRetrieve: number): Promise<EstimatedFeeResponse> => {
      if (!ethAddress || !config) {
        throw new Error('Insufficient data for fee estimation');
      }

      try {
        const encodedData = encodeFunctionData({
          abi: withdrawAllDelegatorRewardsAbi,
          functionName: 'claimRewards',
          args: [ethAddress, maxRetrieve],
        });

        console.log('Encoded data:', encodedData);

        const estimatedGas = await estimateGas(config, {
          to: DISTRIBUTION_PRECOMPILE_ADDRESS,
          data: encodedData,
          account: ethAddress,
        });

        console.log('Estimated gas:', estimatedGas);

        const gasPrice = await getGasPrice(config);

        console.log('Gas price:', gasPrice);

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

  // Unified function to estimate fee for both regular and precompile claiming rewards
  const handleUnifiedClaimAllRewardsEstimatedFee = useCallback(
    async (
      validatorAddresses: string[],
      maxRetrieve: number,
      usePrecompile = false,
    ): Promise<EstimatedFeeResponse> => {
      if (usePrecompile) {
        return handlePrecompileClaimAllRewardsEstimatedFee(maxRetrieve);
      } else {
        return handleGetAllRewardEstimatedFee(validatorAddresses);
      }
    },
    [
      handlePrecompileClaimAllRewardsEstimatedFee,
      handleGetAllRewardEstimatedFee,
    ],
  );

  // Get total rewards
  const handleGetTotalRewardsPrecompile = useCallback(async () => {
    if (!ethAddress || !config) {
      throw new Error('Insufficient data for total rewards');
    }

    try {
      const encodedData = encodeFunctionData({
        abi: delegationTotalRewardsAbi,
        functionName: 'delegationTotalRewards',
        args: [ethAddress],
      });

      console.log('Encoded data:', encodedData);

      const totalRewards = await readContract(config, {
        address: DISTRIBUTION_PRECOMPILE_ADDRESS,
        abi: delegationTotalRewardsAbi,
        functionName: 'delegationTotalRewards',
        args: [ethAddress],
      });

      console.log('Total rewards:', totalRewards);

      return totalRewards as [
        {
          validatorvalidatorAddress: string;
          reward: { amount: bigint; denom: string; precision: number };
        }[],
        { amount: bigint; denom: string; precision: number }[],
      ];
    } catch (error) {
      console.error('Error getting total rewards:', error);
      throw error;
    }
  }, [ethAddress, config]);

  // Approve for staking operations
  const handleStakingApprove = useCallback(async () => {
    console.log('handleStakingApprove');
    if (!ethAddress || !writeContractAsync) {
      throw new Error('No eth address or write contract available');
    }

    const txHash = await writeContractAsync({
      address: STAKING_PRECOMPILE_ADDRESS,
      abi: approveAbi,
      functionName: 'approve',
      args: [ethAddress, MAX_UINT256_MINUS_ONE, stakingMessageTypes],
    });

    if (!txHash) {
      throw new Error('Staking approve transaction failed');
    }

    const receipt = await waitForTransactionReceipt(config, { hash: txHash });

    if (receipt.status !== 'success') {
      throw new Error('Staking approve transaction failed');
    }

    return receipt;
  }, [ethAddress, writeContractAsync, config]);

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
    getTotalRewards: handleGetTotalRewardsPrecompile,
    approveStaking: handleStakingApprove,
  };
}

export function useStakingAllowance(
  owner: string | undefined,
  spender: string | undefined,
  method: string,
) {
  const { data: allowance, refetch } = useReadContract<
    typeof allowanceAbi,
    'allowance',
    [string, string, string],
    Config,
    bigint
  >({
    address: STAKING_PRECOMPILE_ADDRESS,
    abi: allowanceAbi,
    functionName: 'allowance',
    args: owner && spender ? [owner, spender, method] : undefined,
    query: {
      enabled: Boolean(owner && spender),
    },
  });

  const checkAllowance = useCallback(async () => {
    const { data } = await refetch();
    return data;
  }, [refetch]);

  return {
    allowance,
    checkAllowance,
  };
}
