'use client';

import { useCallback, useState } from 'react';
import { getWithdrawals } from 'viem/op-stack';
import { useOpStackClients } from './use-op-stack-clients';
import { WithdrawalOrder, WithdrawalStatus } from '../types/withdrawal-order';

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

/**
 * Hook to manage withdrawal timers for prove and finalize steps
 */
export function useWithdrawalTimers(): UseWithdrawalTimersReturn {
  const [timers, setTimers] = useState<Map<string, TimerInfo>>(() => {
    return new Map();
  });
  const { publicClientReadonlyL2, publicClientReadonlyL1, chains } =
    useOpStackClients();

  const formatTimeRemaining = useCallback((seconds: number): string => {
    if (seconds <= 0) {
      return 'Ready now';
    }

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const parts: string[] = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (remainingSeconds > 0 && days === 0) parts.push(`${remainingSeconds}s`);

    return parts.join(' ') || '0s';
  }, []);

  const getTimeToProve = useCallback(
    async (order: WithdrawalOrder): Promise<TimerInfo | null> => {
      if (order.status !== WithdrawalStatus.INITIATED) {
        return null;
      }

      try {
        // Get withdrawal receipt from L2
        const receipt = await publicClientReadonlyL2.getTransactionReceipt({
          hash: order.initiateHash as `0x${string}`,
        });

        // Get time to prove
        const { seconds, timestamp } =
          await publicClientReadonlyL1.getTimeToProve({
            receipt,
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

        console.log('[useWithdrawalTimers] getTimeToProve', timerInfo);
        return timerInfo;
      } catch (error) {
        console.error('Failed to get time to prove:', error);
        return null;
      }
    },
    [
      publicClientReadonlyL1,
      publicClientReadonlyL2,
      chains.L2_WITH_CONTRACTS,
      formatTimeRemaining,
    ],
  );

  const getTimeToFinalize = useCallback(
    async (order: WithdrawalOrder): Promise<TimerInfo | null> => {
      if (order.status !== WithdrawalStatus.PROVED) {
        return null;
      }

      try {
        // Get withdrawal receipt from L2
        const receipt = await publicClientReadonlyL2.getTransactionReceipt({
          hash: order.initiateHash as `0x${string}`,
        });

        // Get withdrawal data from receipt
        const [withdrawal] = getWithdrawals(receipt);

        // Get time to finalize
        const { seconds, timestamp } =
          await publicClientReadonlyL1.getTimeToFinalize({
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
    [
      publicClientReadonlyL1,
      publicClientReadonlyL2,
      chains.L2_WITH_CONTRACTS,
      formatTimeRemaining,
    ],
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
