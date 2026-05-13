'use client';

import { useCallback, useState, useEffect, useMemo } from 'react';
import { useTranslate } from '@tolgee/react';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { getAddressExplorerUrl, getTxExplorerUrl } from '@haqq/shell-shared';
import {
  Button,
  Tooltip,
  Modal,
  ModalCloseButton,
  ModalHeading,
} from '@haqq/shell-ui-kit';
import { getOpStackChains } from '../constants/op-stack-config';
import { useL2ToL1Withdrawal } from '../hooks/use-l2-to-l1-withdrawal';
import { useWithdrawalOrders } from '../hooks/use-withdrawal-orders';
import { formatTimeRemaining } from '../hooks/use-withdrawal-timers';
import { WithdrawalOrder, WithdrawalStatus } from '../types/withdrawal-order';

const formatAge = (createdAt: number, now: number) => {
  const seconds = Math.max(0, Math.floor((now - createdAt) / 1000));
  if (seconds < 60) return 'just now';
  return `${formatTimeRemaining(seconds)} ago`;
};

interface WithdrawalOrderCardProps {
  order: WithdrawalOrder;
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString();
};

const formatAmount = (amount: number, symbol: string) => {
  return `${amount.toFixed(6)} ${symbol}`;
};

export function WithdrawalOrderCard({ order }: WithdrawalOrderCardProps) {
  const { t } = useTranslate('common');
  const { isConnected } = useAccount();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [timerInfo, setTimerInfo] = useState<{
    seconds: number;
    isReady: boolean;
    formattedTime: string;
  } | null>(null);
  const [now, setNow] = useState(() => {
    return Date.now();
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 30000);
    return () => {
      return clearInterval(interval);
    };
  }, []);

  const { deleteOrderByInitiateHash, updateOrderByInitiateHash } =
    useWithdrawalOrders();

  const reset = useCallback(() => {
    setIsProcessing(false);
  }, []);

  const {
    proveWithdrawal,
    finalizeWithdrawal,
    isProving,
    isFinalizing,
    getTimeToProve,
    getTimeToFinalize,
    getWaitingTimeWarning,
  } = useL2ToL1Withdrawal({
    onProveSuccess: reset,
    onFinalizeSuccess: reset,
    onError: reset,
  });

  // Update timer information for this order.
  //
  // Monotonic clamp: viem's getTimeToNextGame returns the timestamp of the
  // *next* L2 dispute game, not the game that will actually cover this
  // receipt's block. When a game lands without including the block, the
  // raw value jumps back up to the next-next game — making the timer
  // appear to restart. We persist the highest timestamp ever seen on the
  // order and never display a value below it (until viem itself flips
  // isReady=true).
  useEffect(() => {
    const updateTimer = async () => {
      const isProveStage = order.status === WithdrawalStatus.INITIATED;
      const isFinalizeStage = order.status === WithdrawalStatus.PROVED;
      if (!isProveStage && !isFinalizeStage) {
        return;
      }

      try {
        const fresh = isProveStage
          ? await getTimeToProve(order.initiateHash)
          : await getTimeToFinalize(order.initiateHash);

        if (!fresh) {
          return;
        }

        const storedTimestamp = isProveStage
          ? (order.timeToProve?.timestamp ?? 0)
          : (order.timeToFinalize?.timestamp ?? 0);

        // viem decides ready; we only smooth the countdown while it's not.
        // Note: viem returns `timestamp` in milliseconds (Date.now() + seconds * 1000),
        // so we compare against Date.now() — not seconds — and convert the diff to seconds.
        const effectiveTimestamp = fresh.isReady
          ? fresh.timestamp
          : Math.max(storedTimestamp, fresh.timestamp);

        const effectiveSeconds = fresh.isReady
          ? fresh.seconds
          : Math.max(0, Math.floor((effectiveTimestamp - Date.now()) / 1000));

        setTimerInfo({
          seconds: effectiveSeconds,
          isReady: fresh.isReady,
          formattedTime: formatTimeRemaining(effectiveSeconds),
        });

        if (!fresh.isReady && effectiveTimestamp > storedTimestamp) {
          updateOrderByInitiateHash(order.initiateHash, {
            [isProveStage ? 'timeToProve' : 'timeToFinalize']: {
              seconds: effectiveSeconds,
              timestamp: effectiveTimestamp,
            },
          });
        }
      } catch (error) {
        console.error('Failed to update timer:', error);
      }
    };

    updateTimer();

    const interval = setInterval(updateTimer, 10000);

    return () => {
      return clearInterval(interval);
    };
  }, [order, getTimeToProve, getTimeToFinalize, updateOrderByInitiateHash]);

  const getStatusIcon = (status: WithdrawalStatus) => {
    switch (status) {
      case WithdrawalStatus.INITIATED:
        return <Clock className="h-4 w-4 text-blue-500" />;
      case WithdrawalStatus.PROVING:
        return <Clock className="h-4 w-4 animate-spin text-yellow-500" />;
      case WithdrawalStatus.PROVED:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case WithdrawalStatus.FINALIZING:
        return <Clock className="h-4 w-4 animate-spin text-yellow-500" />;
      case WithdrawalStatus.FINALIZED:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case WithdrawalStatus.FAILED:
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: WithdrawalStatus) => {
    switch (status) {
      case WithdrawalStatus.INITIATED:
        return t('withdrawal-status-initiated', 'Initiated ');
      case WithdrawalStatus.PROVING:
        return t('withdrawal-status-proving', 'Proving withdrawal...');
      case WithdrawalStatus.PROVED:
        return t('withdrawal-status-proved', 'Proved');
      case WithdrawalStatus.FINALIZING:
        return t('withdrawal-status-finalizing', 'Finalizing withdrawal...');
      case WithdrawalStatus.FINALIZED:
        return t('withdrawal-status-finalized', 'Finalized');
      case WithdrawalStatus.FAILED:
        return t('withdrawal-status-failed', 'Failed');
      default:
        return t('withdrawal-status-unknown', 'Unknown status');
    }
  };

  const getNextAction = useCallback(
    (order: WithdrawalOrder) => {
      switch (order.status) {
        case WithdrawalStatus.INITIATED:
          return {
            label: t('action-prove', 'Prove'),
            action: () => {
              return handleProve(order);
            },
            disabled: isProving || isProcessing,
          };
        case WithdrawalStatus.PROVED:
          return {
            label: t('action-finalize', 'Finalize'),
            action: () => {
              return handleFinalize(order);
            },
            disabled: isFinalizing || isProcessing,
          };
        default:
          return null;
      }
    },
    [isProving, isProcessing, isFinalizing, isProcessing, t],
  );

  const handleProve = useCallback(
    async (order: WithdrawalOrder) => {
      setIsProcessing(true);
      try {
        await proveWithdrawal(order.initiateHash);
      } catch (error) {
        console.error('Failed to prove withdrawal:', error);
      }
    },
    [proveWithdrawal],
  );

  const handleFinalize = useCallback(
    async (order: WithdrawalOrder) => {
      setIsProcessing(true);
      try {
        await finalizeWithdrawal(order.initiateHash);
      } catch (error) {
        console.error('Failed to finalize withdrawal:', error);
      }
    },
    [finalizeWithdrawal],
  );

  const handleDelete = useCallback(() => {
    setIsDeleteModalOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    deleteOrderByInitiateHash(order.initiateHash);
    setIsDeleteModalOpen(false);
  }, [deleteOrderByInitiateHash, order.initiateHash]);

  const cancelDelete = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, []);

  const nextAction = useMemo(() => {
    return getNextAction(order);
  }, [order, getNextAction]);
  const warning = useMemo(() => {
    return getWaitingTimeWarning(order.status);
  }, [order.status, getWaitingTimeWarning]);

  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              {getStatusIcon(order.status)}
              <span className="font-medium text-gray-900">
                {formatAmount(order.amount, order.tokenSymbol)}
              </span>
              <span className="text-sm text-gray-500">
                {getStatusText(order.status)}
              </span>

              <div className="ml-auto flex items-center gap-2">
                {nextAction && (
                  <Button
                    onClick={nextAction.action}
                    variant={5}
                    disabled={
                      nextAction.disabled ||
                      isProcessing ||
                      !timerInfo?.isReady ||
                      !isConnected
                    }
                    className="rounded-md px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        {t('processing', 'Processing...')}
                      </div>
                    ) : (
                      nextAction.label
                    )}
                  </Button>
                )}
                <button
                  onClick={handleDelete}
                  className="rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-red-600"
                  title={t('delete-order', 'Delete order')}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Timer Information */}
            {timerInfo && (
              <div className="mb-2 rounded-md bg-blue-50 p-2">
                <div className="flex items-center justify-between">
                  {warning && !timerInfo?.isReady && (
                    <Tooltip text={warning}>
                      <span className="cursor-pointer text-sm font-medium text-blue-800">
                        {order.status === WithdrawalStatus.INITIATED
                          ? 'Time to prove:'
                          : 'Time to finalize:'}
                      </span>
                    </Tooltip>
                  )}
                  <span
                    className={`font-mono text-sm ${timerInfo.isReady ? 'text-green-600' : 'text-blue-600'}`}
                  >
                    {timerInfo.formattedTime}
                  </span>
                </div>
                {timerInfo.isReady && (
                  <div className="mt-1 text-xs font-medium text-green-600">
                    ✅ Ready to{' '}
                    {order.status === WithdrawalStatus.INITIATED
                      ? 'prove'
                      : 'finalize'}
                    !
                  </div>
                )}
              </div>
            )}

            <div className="space-y-1 text-sm text-gray-600">
              <div className="mb-1 text-xs text-gray-500">
                <span className="font-medium">
                  {t('initiated', 'Initiated')}:
                </span>{' '}
                <span title={formatDate(order.createdAt)}>
                  {formatAge(order.createdAt, now)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div>
                  <span className="font-medium">From:</span>{' '}
                  <Link
                    href={getAddressExplorerUrl(
                      order.fromAddress,
                      getOpStackChains(order.sourceChainId).L2.id,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-blue-600 hover:text-blue-800"
                    title={order.fromAddress}
                  >
                    {order.fromAddress.slice(0, 6)}...
                    {order.fromAddress.slice(-4)}
                  </Link>
                </div>
                <div>
                  <span className="font-medium">To:</span>{' '}
                  <Link
                    href={getAddressExplorerUrl(
                      order.toAddress,
                      getOpStackChains(order.targetChainId).L1.id,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-blue-600 hover:text-blue-800"
                    title={order.toAddress}
                  >
                    {order.toAddress.slice(0, 6)}...{order.toAddress.slice(-4)}
                  </Link>
                </div>

                {order.proveHash && (
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Prove:</span>
                    <Link
                      href={getTxExplorerUrl(
                        order.proveHash,
                        getOpStackChains(order.sourceChainId).L1.id,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                      {order.proveHash.slice(0, 10)}...
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                )}

                {order.finalizeHash && (
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Finalize:</span>
                    <Link
                      href={getTxExplorerUrl(
                        order.finalizeHash,
                        getOpStackChains(order.sourceChainId).L1.id,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                      {order.finalizeHash.slice(0, 10)}...
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                )}
              </div>

              {order.error && (
                <div className="mt-1 text-xs text-red-600">
                  <span className="font-medium">Error:</span> {order.error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={cancelDelete}>
        <div className="text-haqq-black mx-auto h-screen w-screen bg-white p-[16px] sm:mx-auto sm:h-auto sm:w-[430px] sm:rounded-[12px] sm:p-[36px]">
          <ModalCloseButton
            onClick={cancelDelete}
            className="absolute end-[16px] top-[16px]"
          />

          <div className="flex w-full flex-col gap-[24px] pt-[24px] sm:pt-[4px]">
            <div>
              <ModalHeading>
                {t('delete-withdrawal-order', 'Delete Withdrawal Order')}
              </ModalHeading>
            </div>

            <div>
              <div className="font-guise text-[15px] leading-[24px] text-gray-700">
                {t(
                  'delete-withdrawal-confirmation',
                  'Are you sure you want to delete this withdrawal order? This action cannot be undone. The withdrawal transaction will remain on the blockchain, but it will be removed from your order list.',
                )}
              </div>
              <div className="mt-4 rounded-md bg-gray-100 p-3">
                <div className="text-sm font-medium text-gray-900">
                  {formatAmount(order.amount, order.tokenSymbol)}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {t('initiated', 'Initiated')}: {formatDate(order.createdAt)}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={cancelDelete}
                variant={2}
                className="flex-1 rounded-md px-4 py-2 text-sm font-medium"
              >
                {t('cancel', 'Cancel')}
              </Button>
              <Button
                onClick={confirmDelete}
                variant={5}
                className="flex-1 rounded-md px-4 py-2 text-sm font-medium text-white"
              >
                {t('delete', 'Delete')}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
