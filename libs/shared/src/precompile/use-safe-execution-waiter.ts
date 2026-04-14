'use client';

import { useCallback } from 'react';
import SafeAppsSDK, { TransactionStatus } from '@safe-global/safe-apps-sdk';
import type { Hash } from 'viem';
import { useConnectorType } from '../hooks/use-autoconnect/use-autoconnect';

/**
 * Polls the Safe SDK for execution status of a Safe transaction hash.
 * Use after writeContractAsync when running inside a Safe app to resolve
 * the eventual on-chain tx hash.
 */
export function useSafeExecutionWaiter() {
  const { isSafe } = useConnectorType();

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

  const waitForSafeExecution = useCallback(
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

  return { isSafe, waitForSafeExecution };
}
