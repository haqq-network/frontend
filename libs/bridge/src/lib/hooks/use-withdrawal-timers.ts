'use client';

import { useCallback, useState } from 'react';
import { getWithdrawals } from 'viem/op-stack';
import { WithdrawalOrder, WithdrawalStatus } from '../types/withdrawal-order';
import { buildPublicClientsForOrder } from '../utils/order-clients';

interface TimerInfo {
  seconds: number;
  timestamp: number;
  isReady: boolean;
  formattedTime: string;
}

interface UseWithdrawalTimersReturn {
  getTimeToProve: (order: WithdrawalOrder) => Promise<TimerInfo | null>;
  getTimeToFinalize: (order: WithdrawalOrder) => Promise<TimerInfo | null>;
  formatTimeRemaining: (seconds: number) => string;
  getWaitingTimeWarning: (status: WithdrawalStatus) => string | null;
  timers: Map<string, TimerInfo>;
}

export function formatTimeRemaining(seconds: number): string {
  if (seconds <= 0) {
    return 'Ready now';
  }

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);

  return parts.join(' ') || '0s';
}

/**
 * Hook to manage withdrawal timers for prove and finalize steps
 */
export function useWithdrawalTimers(): UseWithdrawalTimersReturn {
  const [timers, setTimers] = useState<Map<string, TimerInfo>>(() => {
    return new Map();
  });

  const getTimeToProve = useCallback(
    async (order: WithdrawalOrder): Promise<TimerInfo | null> => {
      if (order.status !== WithdrawalStatus.INITIATED) {
        return null;
      }

      try {
        const { chains, publicClientL1, publicClientL2 } =
          buildPublicClientsForOrder(order);

        // Get withdrawal receipt from L2 — needed for its L2 block number,
        // which is the input to the dispute-game lookup.
        const receipt = await publicClientL2.getTransactionReceipt({
          hash: order.initiateHash as `0x${string}`,
        });

        // Time until the next L2 dispute game covering this receipt's block
        // is submitted. Fault-proof equivalent of the deprecated
        // getTimeToProve (which relied on the L2OutputOracle).
        const { seconds, timestamp } = await publicClientL1.getTimeToNextGame({
          l2BlockNumber: receipt.blockNumber,
          targetChain: chains.L2_WITH_CONTRACTS,
        });

        const isReady = seconds <= 0;
        const formattedTime = formatTimeRemaining(seconds);

        const timerInfo: TimerInfo = {
          seconds,
          timestamp: timestamp ?? 0,
          isReady,
          formattedTime,
        };

        // Cache the timer info
        setTimers((prev) => {
          return new Map(prev.set(`${order.id}-prove`, timerInfo));
        });

        return timerInfo;
      } catch (error) {
        console.error('Failed to get time to prove:', error);
        return null;
      }
    },
    [],
  );

  const getTimeToFinalize = useCallback(
    async (order: WithdrawalOrder): Promise<TimerInfo | null> => {
      if (order.status !== WithdrawalStatus.PROVED) {
        return null;
      }

      try {
        const { chains, publicClientL1, publicClientL2 } =
          buildPublicClientsForOrder(order);

        // Get withdrawal receipt from L2
        const receipt = await publicClientL2.getTransactionReceipt({
          hash: order.initiateHash as `0x${string}`,
        });

        // Get withdrawal data from receipt
        const [withdrawal] = getWithdrawals(receipt);

        // Get time to finalize
        const { seconds, timestamp } = await publicClientL1.getTimeToFinalize({
          withdrawalHash: withdrawal.withdrawalHash,
          targetChain: chains.L2_WITH_CONTRACTS,
        });

        const isReady = seconds <= 0;
        const formattedTime = formatTimeRemaining(seconds);

        const timerInfo: TimerInfo = {
          seconds,
          timestamp,
          isReady,
          formattedTime,
        };

        // Cache the timer info
        setTimers((prev) => {
          return new Map(prev.set(`${order.id}-finalize`, timerInfo));
        });

        return timerInfo;
      } catch (error) {
        console.error('Failed to get time to finalize:', error);
        return null;
      }
    },
    [],
  );

  const getWaitingTimeWarning = useCallback(
    (status: WithdrawalStatus): string | null => {
      switch (status) {
        case WithdrawalStatus.INITIATED:
          return '⏳ Waiting for L2 output proposal (up to 1 hour). You can prove the withdrawal once ready.';
        case WithdrawalStatus.PROVING:
          return '⏳ Proving withdrawal on L1. This may take a few minutes.';
        case WithdrawalStatus.PROVED:
          return '⏳ Waiting for finalization period (7 days). You can finalize the withdrawal once ready.';
        case WithdrawalStatus.FINALIZING:
          return '⏳ Finalizing withdrawal on L1. This may take a few minutes.';
        case WithdrawalStatus.FINALIZED:
          return '✅ Withdrawal completed successfully!';
        case WithdrawalStatus.FAILED:
          return '❌ Withdrawal failed. Please try again.';
        default:
          return null;
      }
    },
    [],
  );

  return {
    timers,
    getTimeToProve,
    getTimeToFinalize,
    formatTimeRemaining,
    getWaitingTimeWarning,
  };
}
