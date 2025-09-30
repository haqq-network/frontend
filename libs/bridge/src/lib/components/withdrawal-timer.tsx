'use client';

import { useEffect, useState } from 'react';
import { useWithdrawalTimers } from '../hooks/use-withdrawal-timers';
import { WithdrawalOrder, WithdrawalStatus } from '../types/withdrawal-order';

interface WithdrawalTimerProps {
  order: WithdrawalOrder;
  onTimerUpdate?: (timerInfo: {
    seconds: number;
    isReady: boolean;
    formattedTime: string;
  }) => void;
}

/**
 * Component to display withdrawal timer information
 */
export function WithdrawalTimer({
  order,
  onTimerUpdate,
}: WithdrawalTimerProps) {
  const [timerInfo, setTimerInfo] = useState<{
    seconds: number;
    isReady: boolean;
    formattedTime: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { getTimeToProve, getTimeToFinalize, getWaitingTimeWarning } =
    useWithdrawalTimers();

  useEffect(() => {
    const updateTimer = async () => {
      if (
        order.status !== WithdrawalStatus.INITIATED &&
        order.status !== WithdrawalStatus.PROVED
      ) {
        return;
      }

      setIsLoading(true);
      try {
        let timer: {
          seconds: number;
          timestamp: number;
          isReady: boolean;
          formattedTime: string;
        } | null = null;

        if (order.status === WithdrawalStatus.INITIATED) {
          timer = await getTimeToProve(order);
        } else if (order.status === WithdrawalStatus.PROVED) {
          timer = await getTimeToFinalize(order);
        }

        if (timer) {
          setTimerInfo({
            seconds: timer.seconds,
            isReady: timer.isReady,
            formattedTime: timer.formattedTime,
          });
          onTimerUpdate?.({
            seconds: timer.seconds,
            isReady: timer.isReady,
            formattedTime: timer.formattedTime,
          });
        }
      } catch (error) {
        console.error('Failed to update timer:', error);
      } finally {
        setIsLoading(false);
      }
    };

    updateTimer();

    // Update timer every 30 seconds
    const interval = setInterval(updateTimer, 30000);

    return () => {
      return clearInterval(interval);
    };
  }, [order, getTimeToProve, getTimeToFinalize, onTimerUpdate]);

  const warning = getWaitingTimeWarning(order.status);

  if (!warning && !timerInfo) {
    return null;
  }

  return (
    <div className="space-y-2">
      {warning && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-600 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
          {warning}
        </div>
      )}

      {timerInfo && (
        <div className="text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">
              {order.status === WithdrawalStatus.INITIATED
                ? 'Time to prove:'
                : 'Time to finalize:'}
            </span>
            <span
              className={`font-mono ${timerInfo.isReady ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}
            >
              {isLoading ? 'Loading...' : timerInfo.formattedTime}
            </span>
          </div>

          {timerInfo.isReady && (
            <div className="mt-2 font-medium text-green-600 dark:text-green-400">
              ✅ Ready to{' '}
              {order.status === WithdrawalStatus.INITIATED
                ? 'prove'
                : 'finalize'}
              !
            </div>
          )}
        </div>
      )}
    </div>
  );
}
