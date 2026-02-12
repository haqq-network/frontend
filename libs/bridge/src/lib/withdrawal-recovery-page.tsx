'use client';

import { useState, useCallback } from 'react';
import { useTranslate } from '@tolgee/react';
import { ArrowLeft, Search, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button, StringInput } from '@haqq/shell-ui-kit';
import { Container } from '@haqq/shell-ui-kit/server';
import { WithdrawalOrderCard } from './components/withdrawal-order-card';
import { useWithdrawalRecovery } from './hooks/use-withdrawal-recovery';

export function WithdrawalRecoveryPage() {
  const { t } = useTranslate('common');
  const [txHash, setTxHash] = useState('');
  const [isValidHash, setIsValidHash] = useState(true);

  const {
    recoverWithdrawal,
    recoveredOrder,
    isRecovering,
    error,
    clearRecovery,
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
          {!recoveredOrder && (
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
                      <div className="mt-2 max-w-[470px] whitespace-pre-line wrap-break-word text-sm text-red-700">
                        {error}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={handleRecover}
                disabled={!txHash || !isValidHash || isRecovering}
                className="flex w-full items-center justify-center"
                variant={5}
              >
                {isRecovering ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {t('loading', 'Loading...')}
                  </div>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    {t('load-withdrawal', 'Load Withdrawal')}
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Recovered Withdrawal Order */}
          {recoveredOrder && (
            <div className="space-y-6">
              <WithdrawalOrderCard order={recoveredOrder} />

              <div className="flex gap-3">
                <Button onClick={clearRecovery} variant={4}>
                  {t('recover-another', 'Recover Another')}
                </Button>
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
