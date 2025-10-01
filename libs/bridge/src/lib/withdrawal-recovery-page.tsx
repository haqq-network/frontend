'use client';

import { useState, useCallback } from 'react';
import { useTranslate } from '@tolgee/react';
import {
  ArrowLeft,
  Search,
  AlertCircle,
  Clock,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';
import { Button, ModalInput, StringInput } from '@haqq/shell-ui-kit';
import { Container } from '@haqq/shell-ui-kit/server';
import { useWithdrawalRecovery } from './hooks/use-withdrawal-recovery';
import { WithdrawalStatus } from './types/withdrawal-order';

export function WithdrawalRecoveryPage() {
  const { t } = useTranslate('common');
  const [txHash, setTxHash] = useState('');
  const [isValidHash, setIsValidHash] = useState(true);

  const {
    recoverWithdrawal,
    recoveredWithdrawal,
    isRecovering,
    error,
    clearRecovery,
    proveWithdrawal,
    finalizeWithdrawal,
    isProving,
    isFinalizing,
  } = useWithdrawalRecovery();

  const validateHash = useCallback((hash: string) => {
    return /^0x[a-fA-F0-9]{64}$/.test(hash);
  }, []);

  const handleHashChange = useCallback(
    (value: string) => {
      setTxHash(value);
      setIsValidHash(validateHash(value));
    },
    [validateHash],
  );

  const handleRecover = useCallback(async () => {
    if (!txHash || !isValidHash) return;

    try {
      await recoverWithdrawal(txHash);
    } catch (err) {
      console.error('Recovery failed:', err);
    }
  }, [txHash, isValidHash, recoverWithdrawal]);

  const handleProve = useCallback(async () => {
    if (!recoveredWithdrawal) return;

    try {
      await proveWithdrawal(recoveredWithdrawal.withdrawalHash);
    } catch (err) {
      console.error('Prove failed:', err);
    }
  }, [recoveredWithdrawal, proveWithdrawal]);

  const handleFinalize = useCallback(async () => {
    if (!recoveredWithdrawal) return;

    try {
      await finalizeWithdrawal(recoveredWithdrawal.withdrawalHash);
    } catch (err) {
      console.error('Finalize failed:', err);
    }
  }, [recoveredWithdrawal, finalizeWithdrawal]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatAmount = (amount: number, symbol: string) => {
    return `${amount.toFixed(6)} ${symbol}`;
  };

  const getStatusIcon = (status: WithdrawalStatus) => {
    switch (status) {
      case WithdrawalStatus.INITIATED:
        return <Clock className="h-5 w-5 text-blue-500" />;
      case WithdrawalStatus.PROVED:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case WithdrawalStatus.FINALIZED:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: WithdrawalStatus) => {
    switch (status) {
      case WithdrawalStatus.INITIATED:
        return t('withdrawal-status-initiated', 'Initiated');
      case WithdrawalStatus.PROVED:
        return t('withdrawal-status-proved', 'Proved');
      case WithdrawalStatus.FINALIZED:
        return t('withdrawal-status-finalized', 'Finalized');
      default:
        return t('withdrawal-status-unknown', 'Unknown');
    }
  };

  return (
    <Container>
      <div className="mx-auto max-w-[600px] py-[40px]">
        <div className="rounded-[12px] bg-white p-[24px] shadow-lg">
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/bridge"
              className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('back-to-bridge', 'Back to Bridge')}
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              {t('recover-withdrawal', 'Recover Withdrawal')}
            </h1>
            <p className="mt-2 text-gray-600">
              {t(
                'recover-withdrawal-description',
                'Enter your withdrawal transaction hash to recover and complete your L2 to L1 withdrawal.',
              )}
            </p>
          </div>

          {/* Transaction Hash Input */}
          {!recoveredWithdrawal && (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {t('transaction-hash', 'Transaction Hash')}
                </label>
                <StringInput
                  placeholder={t(
                    'enter-transaction-hash',
                    'Enter transaction hash',
                  )}
                  value={txHash}
                  onChange={(value) => {
                    return handleHashChange(value ?? '');
                  }}
                  hint={
                    !isValidHash && txHash
                      ? t(
                          'invalid-hash',
                          'Please enter a valid transaction hash',
                        )
                      : undefined
                  }
                  id="tx-hash"
                />
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        {t('recovery-error', 'Recovery Error')}
                      </h3>
                      <div className="mt-2 text-sm text-red-700">{error}</div>
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={handleRecover}
                disabled={!txHash || !isValidHash || isRecovering}
                className="w-full"
              >
                {isRecovering ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {t('recovering', 'Recovering...')}
                  </div>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    {t('recover-withdrawal', 'Recover Withdrawal')}
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Recovered Withdrawal Details */}
          {recoveredWithdrawal && (
            <div className="space-y-6">
              {/* Status Card */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(recoveredWithdrawal.status)}
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {formatAmount(
                          recoveredWithdrawal.amount,
                          recoveredWithdrawal.tokenSymbol,
                        )}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {getStatusText(recoveredWithdrawal.status)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Withdrawal Details */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">From:</span>{' '}
                      <span className="font-mono">
                        {recoveredWithdrawal.fromAddress.slice(0, 6)}...
                        {recoveredWithdrawal.fromAddress.slice(-4)}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">To:</span>{' '}
                      <span className="font-mono">
                        {recoveredWithdrawal.toAddress.slice(0, 6)}...
                        {recoveredWithdrawal.toAddress.slice(-4)}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium">Withdrawal Hash:</span>{' '}
                      <span className="break-all font-mono text-xs">
                        {recoveredWithdrawal.withdrawalHash}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Initiated:</span>{' '}
                      {formatDate(recoveredWithdrawal.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Timer Information */}
                {recoveredWithdrawal.timeToProve &&
                  recoveredWithdrawal.status === WithdrawalStatus.INITIATED && (
                    <div className="mt-4 rounded-md bg-blue-50 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-800">
                          Time to prove:
                        </span>
                        <span
                          className={`font-mono text-sm ${recoveredWithdrawal.timeToProve.isReady ? 'text-green-600' : 'text-blue-600'}`}
                        >
                          {recoveredWithdrawal.timeToProve.formattedTime}
                        </span>
                      </div>
                      {recoveredWithdrawal.timeToProve.isReady && (
                        <div className="mt-1 text-xs font-medium text-green-600">
                          ✅ Ready to prove!
                        </div>
                      )}
                    </div>
                  )}

                {recoveredWithdrawal.timeToFinalize &&
                  recoveredWithdrawal.status === WithdrawalStatus.PROVED && (
                    <div className="mt-4 rounded-md bg-blue-50 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-800">
                          Time to finalize:
                        </span>
                        <span
                          className={`font-mono text-sm ${recoveredWithdrawal.timeToFinalize.isReady ? 'text-green-600' : 'text-blue-600'}`}
                        >
                          {recoveredWithdrawal.timeToFinalize.formattedTime}
                        </span>
                      </div>
                      {recoveredWithdrawal.timeToFinalize.isReady && (
                        <div className="mt-1 text-xs font-medium text-green-600">
                          ✅ Ready to finalize!
                        </div>
                      )}
                    </div>
                  )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button onClick={clearRecovery} variant={5}>
                  {t('recover-another', 'Recover Another')}
                </Button>

                {recoveredWithdrawal.canProve && (
                  <Button
                    onClick={handleProve}
                    disabled={isProving}
                    className="flex-1"
                  >
                    {isProving ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        {t('proving', 'Proving...')}
                      </div>
                    ) : (
                      t('prove-withdrawal', 'Prove Withdrawal')
                    )}
                  </Button>
                )}

                {recoveredWithdrawal.canFinalize && (
                  <Button
                    onClick={handleFinalize}
                    disabled={isFinalizing}
                    className="flex-1"
                  >
                    {isFinalizing ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        {t('finalizing', 'Finalizing...')}
                      </div>
                    ) : (
                      t('finalize-withdrawal', 'Finalize Withdrawal')
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Help Text */}
          <div className="mt-6 rounded-lg bg-blue-50 p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-blue-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  {t('help-title', 'Need Help?')}
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    {t(
                      'help-description',
                      "You can find your withdrawal transaction hash in your wallet or blockchain explorer. Make sure you're connected to the correct network before proceeding.",
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
