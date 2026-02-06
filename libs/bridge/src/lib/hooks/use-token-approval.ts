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

/** Receipt polling interval (ms) to limit RPC requests */
const RECEIPT_POLL_INTERVAL = 2_000;

/**
 * Hook to handle ERC-20 token approval transactions.
 * Uses useWriteContract's data for the tx hash (single source of truth) and
 * batches receipt polling to reduce RPC requests.
 */
export function useTokenApproval({
  tokenAddress,
  spenderAddress,
  onSuccess,
  onError,
}: UseTokenApprovalParams): UseTokenApprovalReturn {
  const [isApproving, setIsApproving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    writeContractAsync,
    data: txHash,
    reset: resetWrite,
  } = useWriteContract();

  const { isLoading: isWaitingForReceipt } = useWaitForTransactionReceipt({
    hash: txHash ?? undefined,
    query: {
      refetchInterval: RECEIPT_POLL_INTERVAL,
    },
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

        const hash = await writeContractAsync({
          address: tokenAddress as `0x${string}`,
          abi: erc20Abi,
          functionName: 'approve',
          args: [spenderAddress as `0x${string}`, amountWei],
        });

        onSuccess?.(hash);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Approval failed';
        setError(errorMessage);
        onError?.(err as Error);
        throw err;
      } finally {
        setIsApproving(false);
      }
    },
    [tokenAddress, spenderAddress, writeContractAsync, onSuccess, onError],
  );

  const reset = useCallback(() => {
    setError(null);
    setIsApproving(false);
    resetWrite();
  }, [resetWrite]);

  return {
    approve,
    isApproving: isApproving || isWaitingForReceipt,
    error,
    reset,
  };
}
