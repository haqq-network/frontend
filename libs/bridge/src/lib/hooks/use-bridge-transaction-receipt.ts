'use client';

import { useState } from 'react';
import { useWaitForTransactionReceipt } from 'wagmi';

export interface UseBridgeTransactionReceiptReturn {
  txHash: string | null;
  setTxHash: (hash: string | null) => void;
  isWaitingForReceipt: boolean;
  isTxSuccess: boolean;
}

/**
 * Hook to manage bridge transaction receipt state
 * Tracks transaction hash and monitors transaction confirmation
 */
export function useBridgeTransactionReceipt(): UseBridgeTransactionReceiptReturn {
  const [txHash, setTxHash] = useState<string | null>(null);

  // Wait for transaction receipt
  const { isLoading: isWaitingForReceipt, isSuccess: isTxSuccess } =
    useWaitForTransactionReceipt({
      hash: txHash as `0x${string}` | undefined,
    });

  return {
    txHash,
    setTxHash,
    isWaitingForReceipt: Boolean(isWaitingForReceipt),
    isTxSuccess: Boolean(isTxSuccess),
  };
}
