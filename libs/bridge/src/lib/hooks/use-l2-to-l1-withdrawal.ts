'use client';

import { useCallback, useState } from 'react';
import { parseEther } from 'viem';
import { getWithdrawals } from 'viem/op-stack';
import { useSwitchChain } from 'wagmi';
import { useToast } from '@haqq/shell-shared';
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
 * Hook to handle L2 to L1 native ETH withdrawals with prove and finalize states
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
    publicClientL1,
    publicClientL2,
    walletClientL1,
    walletClientL2,
    chains,
    publicClientReadonlyL1,
    publicClientReadonlyL2,
    walletClientReadonlyL1,
    walletClientReadonlyL2,
  } = useOpStackClients();

  const toast = useToast();

  const initiateWithdrawal = useCallback(
    async (amount: number, toAddress: string): Promise<string> => {
      if (!walletClientL2) {
        throw new Error('Wallet not connected or wallet client not available');
      }

      setIsProcessing(true);
      setError(null);

      try {
        // Step 1: Build parameters to initiate the withdrawal transaction on the L1
        // According to Viem docs: "Build parameters to initiate the withdrawal transaction on the L1"
        const args = await publicClientL1.buildInitiateWithdrawal({
          account: walletClientL2.account,
          to: toAddress as `0x${string}`,
          value: parseEther(amount.toString()),
          gas: 21_000n, // Gas limit for transaction execution on the L1
        });

        // Step 2: Execute the initiate withdrawal transaction on the L2
        // According to Viem docs: "Execute the initiate withdrawal transaction on the L2"
        const hash = await walletClientL2.initiateWithdrawal({
          ...args,
        });

        // Step 3: Wait for the initiate withdrawal transaction receipt
        // According to Viem docs: "Wait for the initiate withdrawal transaction receipt"
        const receipt = await publicClientReadonlyL2.waitForTransactionReceipt({
          hash,
        });

        console.log(`Withdrawal initiated successfully: ${hash}`);

        // Save withdrawal order to local storage
        addWithdrawalOrder({
          amount,
          toAddress,
          fromAddress: walletClientL2.account.address,
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
      walletClientL2,
      publicClientL1,
      publicClientL2,
      publicClientReadonlyL2,
      chains,
      addWithdrawalOrder,
      onSuccess,
      onError,
    ],
  );
  const { switchChainAsync } = useSwitchChain();

  const proveWithdrawal = useCallback(
    async (withdrawalHash: string): Promise<string> => {
      if (!walletClientL1) {
        throw new Error('Wallet client not available for proving');
      }

      setIsProving(true);
      setError(null);

      try {
        // Step 1: Get withdrawal receipt from L2
        const receipt = await publicClientReadonlyL2.getTransactionReceipt({
          hash: withdrawalHash as `0x${string}`,
        });

        // Step 2: Wait until the withdrawal is ready to prove
        // According to Viem docs: "Wait until the withdrawal is ready to prove"
        const { output, withdrawal } = await publicClientReadonlyL1.waitToProve(
          {
            receipt,
            targetChain: chains.L2_WITH_CONTRACTS,
          },
        );

        // Step 3: Build parameters to prove the withdrawal on the L2
        // According to Viem docs: "Build parameters to prove the withdrawal on the L2"
        const proveArgs = await publicClientReadonlyL2.buildProveWithdrawal({
          output,
          withdrawal,
        });

        await switchChainAsync({ chainId: chains.L1.id });

        // Step 4: Prove the withdrawal on the L1
        // According to Viem docs: "Prove the withdrawal on the L1"
        const proveHash = await walletClientL1.proveWithdrawal({
          ...proveArgs,
          targetChain: chains.L2_WITH_CONTRACTS,
        });

        // Step 5: Wait until the prove withdrawal is processed
        // According to Viem docs: "Wait until the prove withdrawal is processed"
        const proveReceipt =
          await publicClientReadonlyL1.waitForTransactionReceipt({
            hash: proveHash,
          });

        console.log(`Withdrawal proved successfully: ${proveHash}`);

        // Update withdrawal order status
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
      walletClientL1,
      publicClientL1,
      publicClientL2,
      publicClientReadonlyL1,
      publicClientReadonlyL2,
      chains,
      updateOrderByInitiateHash,
      onProveSuccess,
      onError,
    ],
  );

  const finalizeWithdrawal = useCallback(
    async (withdrawalHash: string): Promise<string> => {
      if (!walletClientL1) {
        throw new Error('Wallet client not available for finalizing');
      }

      setIsFinalizing(true);
      setError(null);

      try {
        // Step 1: Get withdrawal receipt from L2
        const receipt = await publicClientReadonlyL2.getTransactionReceipt({
          hash: withdrawalHash as `0x${string}`,
        });

        // Step 2: Get withdrawal data from receipt
        // According to Viem docs: "Get withdrawals from receipt"
        const [withdrawal] = getWithdrawals(receipt);

        // Step 3: Wait until the withdrawal is ready to finalize
        // According to Viem docs: "Wait until the withdrawal is ready to finalize"
        await publicClientReadonlyL1.waitToFinalize({
          targetChain: chains.L2_WITH_CONTRACTS,
          withdrawalHash: withdrawal.withdrawalHash,
        });

        await switchChainAsync({ chainId: chains.L1.id });

        // Step 4: Finalize the withdrawal
        // According to Viem docs: "Finalize the withdrawal"
        const finalizeHash = await walletClientL1.finalizeWithdrawal({
          targetChain: chains.L2_WITH_CONTRACTS,
          withdrawal,
        });

        // Step 5: Wait until the withdrawal is finalized
        // According to Viem docs: "Wait until the withdrawal is finalized"
        const finalizeReceipt =
          await publicClientReadonlyL1.waitForTransactionReceipt({
            hash: finalizeHash,
          });

        console.log(`Withdrawal finalized successfully: ${finalizeHash}`);

        // Update withdrawal order status
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
      walletClientL1,
      publicClientL1,
      publicClientL2,
      publicClientReadonlyL1,
      publicClientReadonlyL2,
      chains,
      updateOrderByInitiateHash,
      onFinalizeSuccess,
      onError,
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
