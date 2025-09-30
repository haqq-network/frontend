'use client';

import { useCallback, useState } from 'react';
import { erc20Abi, parseUnits } from 'viem';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

interface UseTokenApprovalParams {
  tokenAddress?: string;
  spenderAddress?: string;
  onSuccess?: (hash: string) => void;
  onError?: (error: Error) => void;
}

interface UseTokenApprovalReturn {
  approve: (amount: number, decimals: number) => Promise<void>;
  isApproving: boolean;
  error: string | null;
  reset: () => void;
}

/**
 * Hook to handle ERC-20 token approval transactions
 */
export function useTokenApproval({
  tokenAddress,
  spenderAddress,
  onSuccess,
  onError,
}: UseTokenApprovalParams): UseTokenApprovalReturn {
  const [isApproving, setIsApproving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { writeContractAsync } = useWriteContract();

  const [txHash, setTxHash] = useState<string | null>(null);

  // Wait for transaction receipt
  const { isLoading: isWaitingForReceipt } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}` | undefined,
  });

  const approve = useCallback(
    async (amount: number, decimals: number) => {
      if (!tokenAddress || !spenderAddress || !writeContractAsync) {
        throw new Error('Missing required parameters for approval');
      }

      setIsApproving(true);
      setError(null);

      try {
        const amountWei = parseUnits(amount.toString(), decimals);

        console.log(`Approving ${amount} tokens for spender ${spenderAddress}`);

        const hash = await writeContractAsync({
          address: tokenAddress as `0x${string}`,
          abi: erc20Abi,
          functionName: 'approve',
          args: [spenderAddress as `0x${string}`, amountWei],
        });

        setTxHash(hash);

        console.log('Approval transaction hash:', hash);
        onSuccess?.(hash);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Approval failed';
        console.error('Approval failed:', err);
        setError(errorMessage);
        onError?.(err as Error);
        throw err;
      } finally {
        setIsApproving(false);
      }
    },
    [
      tokenAddress,
      spenderAddress,
      writeContractAsync,
      onSuccess,
      onError,
      setTxHash,
    ],
  );

  const reset = useCallback(() => {
    setError(null);
    setIsApproving(false);
  }, []);

  return {
    approve,
    isApproving: isApproving || isWaitingForReceipt,
    error,
    reset,
  };
}
