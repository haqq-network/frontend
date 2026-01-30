'use client';

import { useCallback, useState } from 'react';
import { parseEther, parseUnits } from 'viem';
import { getWithdrawals } from 'viem/op-stack';
import { useAccount, useSwitchChain, useWriteContract } from 'wagmi';
import {
  useToast,
  L2StandardBridgeAbi,
  L2_STANDARD_BRIDGE_ADDRESS,
} from '@haqq/shell-shared';
import { useOpStackClients } from './use-op-stack-clients';
import { useWithdrawalOrders } from './use-withdrawal-orders';
import { useWithdrawalTimers } from './use-withdrawal-timers';
import { WithdrawalStatus } from '../types/withdrawal-order';

interface UseL2ToL1WithdrawalParams {
  onSuccess?: (hash: string) => void;
  onError?: (error: Error) => void;
  onProveSuccess?: (hash: string) => void;
  onFinalizeSuccess?: (hash: string) => void;
  tokenSymbol?: string;
}

interface UseL2ToL1WithdrawalReturn {
  initiateWithdrawal: (amount: number, toAddress: string) => Promise<string>;
  initiateERC20Withdrawal: (
    tokenAddress: string,
    amount: number,
    toAddress: string,
    tokenDecimals?: number,
    tokenSymbol?: string,
  ) => Promise<string>;
  proveWithdrawal: (withdrawalHash: string) => Promise<string>;
  finalizeWithdrawal: (withdrawalHash: string) => Promise<string>;
  isProcessing: boolean;
  isProving: boolean;
  isFinalizing: boolean;
  error: string | null;
  reset: () => void;
  // Timer functionality
  getTimeToProve: (withdrawalHash: string) => Promise<{
    seconds: number;
    timestamp: number;
    isReady: boolean;
    formattedTime: string;
  } | null>;
  getTimeToFinalize: (withdrawalHash: string) => Promise<{
    seconds: number;
    timestamp: number;
    isReady: boolean;
    formattedTime: string;
  } | null>;
  getWaitingTimeWarning: (status: WithdrawalStatus) => string | null;
}

/**
 * Hook to handle L2 to L1 withdrawals (both ETH and ERC20 tokens) with prove and finalize states
 */
export function useL2ToL1Withdrawal({
  onSuccess,
  onError,
  onProveSuccess,
  onFinalizeSuccess,
  tokenSymbol = 'ETH',
}: UseL2ToL1WithdrawalParams): UseL2ToL1WithdrawalReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProving, setIsProving] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    addWithdrawalOrder,
    updateOrderByInitiateHash,
    getOrderByInitiateHash,
  } = useWithdrawalOrders();
  const { getTimeToProve, getTimeToFinalize, getWaitingTimeWarning } =
    useWithdrawalTimers();
  const {
    getWalletClientL1,
    getWalletClientL2,
    chains,
    publicClientReadonlyL1,
    publicClientReadonlyL2,
  } = useOpStackClients();

  const { isConnected, address } = useAccount();
  const toast = useToast();
  const { writeContractAsync } = useWriteContract();

  const initiateWithdrawal = useCallback(
    async (amount: number, toAddress: string): Promise<string> => {
      const walletClient = await getWalletClientL2();

      if (!walletClient) {
        throw new Error('Wallet not connected or wallet client not available');
      }

      setIsProcessing(true);
      setError(null);

      const LOG_PREFIX = '[L2→L1 Withdrawal]';
      try {
        // Step 1: Build parameters to initiate the withdrawal transaction on the L1
        // According to Viem docs: "Build parameters to initiate the withdrawal transaction on the L1"
        console.log(
          `${LOG_PREFIX} Step 1: Building initiate withdrawal params (amount: ${amount}, to: ${toAddress})`,
        );
        const args = await publicClientReadonlyL1.buildInitiateWithdrawal({
          account: walletClient.account.address,
          to: toAddress as `0x${string}`,
          value: parseEther(amount.toString()),
        });
        console.log(`${LOG_PREFIX} Step 1: Initiate withdrawal params built`);

        // Step 2: Execute the initiate withdrawal transaction on the L2
        // According to Viem docs: "Execute the initiate withdrawal transaction on the L2"
        console.log(
          `${LOG_PREFIX} Step 2: Executing initiate withdrawal on L2`,
        );
        const hash = await walletClient.initiateWithdrawal({
          ...args,
        });
        console.log(
          `${LOG_PREFIX} Step 2: Initiate withdrawal tx sent, hash: ${hash}`,
        );

        // Step 3: Wait for the initiate withdrawal transaction receipt
        // According to Viem docs: "Wait for the initiate withdrawal transaction receipt"
        console.log(
          `${LOG_PREFIX} Step 3: Waiting for initiate withdrawal receipt`,
        );
        const receipt = await publicClientReadonlyL2.waitForTransactionReceipt({
          hash,
        });
        console.log(
          `${LOG_PREFIX} Step 3: Initiate withdrawal confirmed, block: ${receipt.blockNumber}`,
        );

        console.log(`${LOG_PREFIX} Withdrawal initiated successfully: ${hash}`);

        // Save withdrawal order to local storage
        console.log(`${LOG_PREFIX} Saving withdrawal order to local storage`);
        addWithdrawalOrder({
          amount,
          toAddress,
          fromAddress: walletClient.account.address,
          initiateHash: hash,
          status: WithdrawalStatus.INITIATED,
          sourceChainId: chains.L2.id,
          targetChainId: chains.L1.id,
          tokenSymbol,
        });

        onSuccess?.(receipt.transactionHash);
        return hash;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Withdrawal initiation failed';
        console.error('Withdrawal initiation failed:', err);
        setError(errorMessage);
        toast.error('Withdrawal initiation failed');
        onError?.(err as Error);
        throw err;
      } finally {
        setIsProcessing(false);
      }
    },
    [
      getWalletClientL2,
      publicClientReadonlyL1,
      publicClientReadonlyL2,
      chains,
      addWithdrawalOrder,
      onSuccess,
      onError,
      tokenSymbol,
      toast,
    ],
  );

  const initiateERC20Withdrawal = useCallback(
    async (
      tokenAddress: string,
      amount: number,
      toAddress: string,
      tokenDecimals = 18,
      tokenSymbolOverride?: string,
    ): Promise<string> => {
      if (!address || !writeContractAsync) {
        throw new Error('Wallet not connected or wallet client not available');
      }

      setIsProcessing(true);
      setError(null);

      const LOG_PREFIX = '[L2→L1 ERC20 Withdrawal]';
      try {
        // Step 1: Parse the token amount with correct decimals
        console.log(
          `${LOG_PREFIX} Step 1: Parsing amount (${amount} with ${tokenDecimals} decimals)`,
        );
        const amountWei = parseUnits(amount.toString(), tokenDecimals);
        console.log(
          `${LOG_PREFIX} Step 1: Amount parsed: ${amountWei.toString()} wei`,
        );

        // Step 2: Call withdrawTo on L2StandardBridge contract
        // According to Optimism docs: withdrawTo initiates ERC20 withdrawal from L2 to L1
        // Using wagmi's writeContractAsync for proper wallet signing compatibility (works with Kepler, MetaMask, etc.)
        console.log(
          `${LOG_PREFIX} Step 2: Calling withdrawTo on L2StandardBridge (token: ${tokenAddress}, to: ${toAddress})`,
        );
        const hash = await writeContractAsync({
          address: L2_STANDARD_BRIDGE_ADDRESS as `0x${string}`,
          abi: L2StandardBridgeAbi,
          functionName: 'withdrawTo',
          args: [
            tokenAddress as `0x${string}`, // _l2Token
            toAddress as `0x${string}`, // _to
            amountWei, // _amount
            200000, // _minGasLimit
            '0x' as `0x${string}`, // _extraData
          ],
        });
        console.log(`${LOG_PREFIX} Step 2: withdrawTo tx sent, hash: ${hash}`);

        // Step 3: Wait for the withdrawal transaction receipt
        console.log(`${LOG_PREFIX} Step 3: Waiting for withdrawal receipt`);
        const receipt = await publicClientReadonlyL2.waitForTransactionReceipt({
          hash,
        });
        console.log(
          `${LOG_PREFIX} Step 3: Withdrawal confirmed, block: ${receipt.blockNumber}`,
        );

        console.log(
          `${LOG_PREFIX} ERC20 withdrawal initiated successfully: ${hash}`,
        );

        // Save withdrawal order to local storage
        console.log(`${LOG_PREFIX} Saving withdrawal order to local storage`);
        addWithdrawalOrder({
          amount,
          toAddress,
          fromAddress: address,
          initiateHash: hash,
          status: WithdrawalStatus.INITIATED,
          sourceChainId: chains.L2.id,
          targetChainId: chains.L1.id,
          tokenSymbol: tokenSymbolOverride || tokenSymbol,
        });

        onSuccess?.(receipt.transactionHash);
        return hash;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'ERC20 withdrawal initiation failed';
        console.error('ERC20 withdrawal initiation failed:', err);
        setError(errorMessage);
        toast.error('ERC20 withdrawal initiation failed');
        onError?.(err as Error);
        throw err;
      } finally {
        setIsProcessing(false);
      }
    },
    [
      address,
      writeContractAsync,
      publicClientReadonlyL2,
      chains,
      addWithdrawalOrder,
      tokenSymbol,
      onSuccess,
      onError,
      toast,
    ],
  );

  const { switchChainAsync } = useSwitchChain();

  const proveWithdrawal = useCallback(
    async (withdrawalHash: string): Promise<string> => {
      if (!isConnected) {
        const errorMessage =
          'Wallet not connected. Please connect your wallet to prove the withdrawal.';
        console.error('Prove withdrawal failed:', errorMessage);
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      const walletClient = await getWalletClientL1();

      if (!walletClient) {
        const errorMessage =
          'Wallet client not available. Please ensure your wallet is connected and try again.';
        console.error('Prove withdrawal failed:', errorMessage);
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      setIsProving(true);
      setError(null);

      const LOG_PREFIX = '[L2→L1 Prove Withdrawal]';
      try {
        // Step 1: Get withdrawal receipt from L2
        console.log(
          `${LOG_PREFIX} Step 1: Getting withdrawal receipt from L2 (hash: ${withdrawalHash})`,
        );
        const receipt = await publicClientReadonlyL2.getTransactionReceipt({
          hash: withdrawalHash as `0x${string}`,
        });
        console.log(
          `${LOG_PREFIX} Step 1: Receipt obtained, block: ${receipt.blockNumber}`,
        );

        // Step 2: Wait until the withdrawal is ready to prove
        // According to Viem docs: "Wait until the withdrawal is ready to prove"
        console.log(
          `${LOG_PREFIX} Step 2: Waiting until withdrawal is ready to prove`,
        );
        const { output, withdrawal } = await publicClientReadonlyL1.waitToProve(
          {
            receipt,
            targetChain: chains.L2_WITH_CONTRACTS,
          },
        );
        console.log(`${LOG_PREFIX} Step 2: Withdrawal ready to prove`);

        // Step 3: Build parameters to prove the withdrawal on the L2
        // According to Viem docs: "Build parameters to prove the withdrawal on the L2"
        console.log(`${LOG_PREFIX} Step 3: Building prove withdrawal params`);
        const proveArgs = await publicClientReadonlyL2.buildProveWithdrawal({
          output,
          withdrawal,
        });
        console.log(`${LOG_PREFIX} Step 3: Prove params built`);

        console.log(`${LOG_PREFIX} Step 4: Switching to L1 chain`);
        await switchChainAsync({ chainId: chains.L1.id });

        // Step 4: Prove the withdrawal on the L1
        // According to Viem docs: "Prove the withdrawal on the L1"
        console.log(`${LOG_PREFIX} Step 4: Executing prove withdrawal on L1`);
        const proveHash = await walletClient.proveWithdrawal({
          ...proveArgs,
          // TODO: Fix this
          targetChain: chains.L2_WITH_CONTRACTS as any,
        });
        console.log(`${LOG_PREFIX} Step 4: Prove tx sent, hash: ${proveHash}`);

        // Step 5: Wait until the prove withdrawal is processed
        // According to Viem docs: "Wait until the prove withdrawal is processed"
        console.log(`${LOG_PREFIX} Step 5: Waiting for prove receipt`);
        const proveReceipt =
          await publicClientReadonlyL1.waitForTransactionReceipt({
            hash: proveHash,
          });
        console.log(
          `${LOG_PREFIX} Step 5: Prove confirmed, block: ${proveReceipt.blockNumber}`,
        );

        // Update withdrawal order status
        console.log(`${LOG_PREFIX} Updating withdrawal order status to PROVED`);
        updateOrderByInitiateHash(withdrawalHash, {
          status: WithdrawalStatus.PROVED,
          proveHash: proveHash,
        });

        onProveSuccess?.(proveReceipt.transactionHash);
        return proveHash;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Prove withdrawal failed';
        console.error('Prove withdrawal failed:', err);

        setError(errorMessage);
        toast.error('Prove withdrawal failed');
        onError?.(err as Error);
        throw err;
      } finally {
        await switchChainAsync({ chainId: chains.L2.id });
        setIsProving(false);
      }
    },
    [
      isConnected,
      getWalletClientL1,
      publicClientReadonlyL1,
      publicClientReadonlyL2,
      chains,
      updateOrderByInitiateHash,
      onProveSuccess,
      onError,
      toast,
      switchChainAsync,
    ],
  );

  const finalizeWithdrawal = useCallback(
    async (withdrawalHash: string): Promise<string> => {
      if (!isConnected) {
        const errorMessage =
          'Wallet not connected. Please connect your wallet to finalize the withdrawal.';
        console.error('Finalize withdrawal failed:', errorMessage);
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      const walletClient = await getWalletClientL1();

      if (!walletClient) {
        const errorMessage =
          'Wallet client not available. Please ensure your wallet is connected and try again.';
        console.error('Finalize withdrawal failed:', errorMessage);
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      setIsFinalizing(true);
      setError(null);

      const LOG_PREFIX = '[L2→L1 Finalize Withdrawal]';
      try {
        // Step 1: Get withdrawal receipt from L2
        console.log(
          `${LOG_PREFIX} Step 1: Getting withdrawal receipt from L2 (hash: ${withdrawalHash})`,
        );
        const receipt = await publicClientReadonlyL2.getTransactionReceipt({
          hash: withdrawalHash as `0x${string}`,
        });
        console.log(
          `${LOG_PREFIX} Step 1: Receipt obtained, block: ${receipt.blockNumber}`,
        );

        // Step 2: Get withdrawal data from receipt
        // According to Viem docs: "Get withdrawals from receipt"
        console.log(
          `${LOG_PREFIX} Step 2: Extracting withdrawal data from receipt`,
        );
        const [withdrawal] = getWithdrawals(receipt);
        console.log(
          `${LOG_PREFIX} Step 2: Withdrawal hash: ${withdrawal.withdrawalHash}`,
        );

        // Step 3: Wait until the withdrawal is ready to finalize
        // According to Viem docs: "Wait until the withdrawal is ready to finalize"
        console.log(
          `${LOG_PREFIX} Step 3: Waiting until withdrawal is ready to finalize`,
        );
        await publicClientReadonlyL1.waitToFinalize({
          targetChain: chains.L2_WITH_CONTRACTS,
          withdrawalHash: withdrawal.withdrawalHash,
        });
        console.log(`${LOG_PREFIX} Step 3: Withdrawal ready to finalize`);

        console.log(`${LOG_PREFIX} Step 4: Switching to L1 chain`);
        await switchChainAsync({ chainId: chains.L1.id });

        // Step 4: Finalize the withdrawal
        // According to Viem docs: "Finalize the withdrawal"
        console.log(
          `${LOG_PREFIX} Step 4: Executing finalize withdrawal on L1`,
        );
        const finalizeHash = await walletClient.finalizeWithdrawal({
          // TODO: Fix this
          targetChain: chains.L2_WITH_CONTRACTS as any,
          withdrawal,
        });
        console.log(
          `${LOG_PREFIX} Step 4: Finalize tx sent, hash: ${finalizeHash}`,
        );

        // Step 5: Wait until the withdrawal is finalized
        // According to Viem docs: "Wait until the withdrawal is finalized"
        console.log(`${LOG_PREFIX} Step 5: Waiting for finalize receipt`);
        const finalizeReceipt =
          await publicClientReadonlyL1.waitForTransactionReceipt({
            hash: finalizeHash,
          });
        console.log(
          `${LOG_PREFIX} Step 5: Finalize confirmed, block: ${finalizeReceipt.blockNumber}`,
        );

        console.log(
          `${LOG_PREFIX} Withdrawal finalized successfully: ${finalizeHash}`,
        );

        // Update withdrawal order status
        console.log(
          `${LOG_PREFIX} Updating withdrawal order status to FINALIZED`,
        );
        updateOrderByInitiateHash(withdrawalHash, {
          status: WithdrawalStatus.FINALIZED,
          finalizeHash: finalizeHash,
        });

        onFinalizeSuccess?.(finalizeReceipt.transactionHash);
        return finalizeHash;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Finalize withdrawal failed';
        console.error('Finalize withdrawal failed:', err);

        setError(errorMessage);
        toast.error('Finalize withdrawal failed');
        onError?.(err as Error);
        throw err;
      } finally {
        await switchChainAsync({ chainId: chains.L2.id });
        setIsFinalizing(false);
      }
    },
    [
      isConnected,
      getWalletClientL1,
      publicClientReadonlyL1,
      publicClientReadonlyL2,
      chains,
      updateOrderByInitiateHash,
      onFinalizeSuccess,
      onError,
      toast,
      switchChainAsync,
    ],
  );

  const reset = useCallback(() => {
    setError(null);
    setIsProcessing(false);
    setIsProving(false);
    setIsFinalizing(false);
  }, []);

  // Timer methods that work with withdrawal hashes
  const getTimeToProveByHash = useCallback(
    async (withdrawalHash: string) => {
      const order = getOrderByInitiateHash(withdrawalHash);
      if (!order) return null;
      return await getTimeToProve(order);
    },
    [getOrderByInitiateHash, getTimeToProve],
  );

  const getTimeToFinalizeByHash = useCallback(
    async (withdrawalHash: string) => {
      const order = getOrderByInitiateHash(withdrawalHash);
      if (!order) return null;
      return await getTimeToFinalize(order);
    },
    [getOrderByInitiateHash, getTimeToFinalize],
  );

  return {
    initiateWithdrawal,
    initiateERC20Withdrawal,
    proveWithdrawal,
    finalizeWithdrawal,
    isProcessing,
    isProving,
    isFinalizing,
    error,
    reset,
    // Timer functionality
    getTimeToProve: getTimeToProveByHash,
    getTimeToFinalize: getTimeToFinalizeByHash,
    getWaitingTimeWarning,
  };
}
