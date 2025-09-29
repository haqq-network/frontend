'use client';

import { useCallback, useState } from 'react';
import { useTranslate } from '@tolgee/react';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { sepolia } from 'viem/chains';
import { haqqDevnet1 } from '@haqq/shell-shared';
import { useL2ToL1Withdrawal } from '../hooks/use-l2-to-l1-withdrawal';
import { WithdrawalOrder, WithdrawalStatus } from '../types/withdrawal-order';

interface PendingWithdrawalsProps {
  orders: WithdrawalOrder[];
  onOrderUpdate?: () => void;
}

export function PendingWithdrawals({
  orders,
  onOrderUpdate,
}: PendingWithdrawalsProps) {
  const { t } = useTranslate('common');
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(
    null,
  );

  const { proveWithdrawal, finalizeWithdrawal, isProving, isFinalizing } =
    useL2ToL1Withdrawal({
      onProveSuccess: () => {
        setProcessingOrderId(null);
        onOrderUpdate?.();
      },
      onFinalizeSuccess: () => {
        setProcessingOrderId(null);
        onOrderUpdate?.();
      },
      onError: () => {
        setProcessingOrderId(null);
        onOrderUpdate?.();
      },
    });

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
        return t('withdrawal-status-initiated', 'Initiated - Ready to prove');
      case WithdrawalStatus.PROVING:
        return t('withdrawal-status-proving', 'Proving withdrawal...');
      case WithdrawalStatus.PROVED:
        return t('withdrawal-status-proved', 'Proved - Ready to finalize');
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

  const getNextAction = (order: WithdrawalOrder) => {
    switch (order.status) {
      case WithdrawalStatus.INITIATED:
        return {
          label: t('action-prove', 'Prove'),
          action: () => {
            return handleProve(order);
          },
          disabled: isProving || processingOrderId !== null,
        };
      case WithdrawalStatus.PROVED:
        return {
          label: t('action-finalize', 'Finalize'),
          action: () => {
            return handleFinalize(order);
          },
          disabled: isFinalizing || processingOrderId !== null,
        };
      default:
        return null;
    }
  };

  const handleProve = useCallback(
    async (order: WithdrawalOrder) => {
      setProcessingOrderId(order.id);
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
      setProcessingOrderId(order.id);
      try {
        await finalizeWithdrawal(order.initiateHash);
      } catch (error) {
        console.error('Failed to finalize withdrawal:', error);
      }
    },
    [finalizeWithdrawal],
  );

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatAmount = (amount: number, symbol: string) => {
    return `${amount.toFixed(6)} ${symbol}`;
  };

  const getExplorerUrl = (hash: string, chainId: number) => {
    if (chainId === sepolia.id) {
      // Sepolia
      return `${sepolia.blockExplorers.default.url}tx/${hash}`;
    } else if (chainId === haqqDevnet1.id) {
      // HAQQ Devnet
      return `${haqqDevnet1.blockExplorers.default.url}tx/${hash}`;
    }
    return '#';
  };

  if (orders.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        {t('pending-withdrawals', 'Pending Withdrawals')}
      </h3>

      <div className="space-y-3">
        {orders.map((order) => {
          const nextAction = getNextAction(order);
          const isProcessing = processingOrderId === order.id;

          return (
            <div
              key={order.id}
              className="rounded-lg border border-gray-200 bg-gray-50 p-4"
            >
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
                  </div>

                  <div className="space-y-1 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">From:</span>{' '}
                      {order.fromAddress.slice(0, 6)}...
                      {order.fromAddress.slice(-4)}
                    </div>
                    <div>
                      <span className="font-medium">To:</span>{' '}
                      {order.toAddress.slice(0, 6)}...
                      {order.toAddress.slice(-4)}
                    </div>
                    <div>
                      <span className="font-medium">Initiated:</span>{' '}
                      {formatDate(order.createdAt)}
                    </div>

                    {order.proveHash && (
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Prove:</span>
                        <a
                          href={getExplorerUrl(order.proveHash, 11155111)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        >
                          {order.proveHash.slice(0, 10)}...
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}

                    {order.finalizeHash && (
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Finalize:</span>
                        <a
                          href={getExplorerUrl(order.finalizeHash, 11155111)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        >
                          {order.finalizeHash.slice(0, 10)}...
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}

                    {order.error && (
                      <div className="mt-1 text-xs text-red-600">
                        <span className="font-medium">Error:</span>{' '}
                        {order.error}
                      </div>
                    )}
                  </div>
                </div>

                {nextAction && (
                  <div className="ml-4">
                    <button
                      onClick={nextAction.action}
                      disabled={nextAction.disabled || isProcessing}
                      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          {t('processing', 'Processing...')}
                        </div>
                      ) : (
                        nextAction.label
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
