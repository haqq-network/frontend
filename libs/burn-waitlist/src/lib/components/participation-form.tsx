'use client';

import { useMemo } from 'react';
import { Button } from '@haqq/shell-ui-kit';
import { ModalInput } from '@haqq/shell-ui-kit';
import { formatUnits } from 'viem';
import { FundsSource } from '../constants/waitlist-config';
import { WaitlistBalances } from './waitlist-balances';
import type { WaitlistBalancesResponse } from '../hooks/use-waitlist-balances';
import { formatEthDecimal, formatNumberWithSuffix } from '@haqq/shell-shared';
import { formatWaitlistPrice } from '../utils/format-waitlist-price';

export interface ParticipationFormProps {
  amount: string;
  source: FundsSource;
  availableBalance?: bigint;
  balances?: WaitlistBalancesResponse;
  /** Current price per token from API (decimal e.g. "8.5" or atto string) - used to show price at submission and estimated receive */
  currentPriceAtto?: string;
  /** User amount in wei - used with currentPriceAtto to compute estimated receive */
  formattedAmount?: bigint;
  onAmountChange: (amount: string) => void;
  onSourceChange: (source: FundsSource) => void;
  onMaxClick: () => void;
  onSubmit: () => void;
  isValid: boolean;
  isSubmitting: boolean;
  error?: string;
  amountError?: string;
  disabled?: boolean;
}

export function ParticipationForm({
  amount,
  source,
  availableBalance,
  balances,
  currentPriceAtto,
  formattedAmount,
  onAmountChange,
  onSourceChange,
  onMaxClick,
  onSubmit,
  isValid,
  isSubmitting,
  error,
  amountError,
  disabled = false,
}: ParticipationFormProps) {
  const formattedBalance = useMemo(() => {
    if (!availableBalance) {
      return '0';
    }
    // Handle negative balances
    if (availableBalance < 0n) {
      return `-${formatEthDecimal(-availableBalance, 4)}`;
    }
    return formatEthDecimal(availableBalance, 4);
  }, [availableBalance]);

  const priceDisplay = useMemo(() => {
    if (!currentPriceAtto) return null;
    const formatted = formatWaitlistPrice(currentPriceAtto, { precision: 4 });
    if (formatted === '' || formatted === '0') return null;
    return formatted;
  }, [currentPriceAtto]);

  /** Price as number (ISLM per token): decimal string (e.g. "8.5") or atto string → ISLM */
  const priceNum = useMemo(() => {
    if (!currentPriceAtto) return null;
    if (currentPriceAtto.includes('.')) {
      const n = Number(currentPriceAtto);
      return Number.isFinite(n) && n > 0 ? n : null;
    }
    try {
      const wei = BigInt(currentPriceAtto);
      if (wei === 0n) return null;
      return Number(wei) / 1e18;
    } catch {
      return null;
    }
  }, [currentPriceAtto]);

  const estimatedReceiveDisplay = useMemo(() => {
    if (!formattedAmount || priceNum == null || priceNum <= 0) return null;
    const amountIslm = Number(formattedAmount) / 1e18;
    const tokens = amountIslm / priceNum;
    return formatWaitlistPrice(tokens, { precision: 4 });
  }, [formattedAmount, priceNum]);

  return (
    <div className="space-y-[20px]">
      <WaitlistBalances balances={balances} />
      {priceDisplay !== null && (
        <div className="rounded-[8px] bg-[#F3F4F6] p-[12px]">
          <div className="text-[12px] text-[#6B7280]">Submission Price</div>
          <div className="text-[14px] font-[500] text-[#0D0D0E]">
            {priceDisplay} ISLM per token
          </div>
        </div>
      )}
      <div>
        <label className="mb-[8px] block text-[14px] font-medium text-[#0D0D0E]">
          Amount
        </label>
        <ModalInput
          symbol="ISLM"
          value={amount || undefined}
          onChange={(value) => {
            // Allow decimal input - pass the string value directly
            // ModalInput's CurrencyInput handles decimal input correctly
            if (value === undefined || value === '') {
              onAmountChange('');
            } else {
              // Keep the string as-is to preserve decimal places
              onAmountChange(value);
            }
          }}
          onMaxButtonClick={onMaxClick}
          hint={
            amountError ? (
              <span className="text-[#EF4444]">{amountError}</span>
            ) : availableBalance && availableBalance < 0n ? (
              <span className="text-[#DC2626]">
                Available Balance: {formattedBalance} ISLM (Insufficient)
              </span>
            ) : (
              <span className="text-[#6B7280]">
                Available Balance: {formattedBalance} ISLM
              </span>
            )
          }
          isMaxButtonDisabled={
            !availableBalance || availableBalance <= 0n || disabled
          }
          disabled={disabled}
        />
        {estimatedReceiveDisplay !== null && (
          <div className="mt-[8px] text-[13px] text-[#6B7280]">
            Estimated receive:{' '}
            <span className="font-[500] text-[#0D0D0E]">
              {estimatedReceiveDisplay}
            </span>{' '}
            tokens
          </div>
        )}
      </div>

      {/* Only show Funds Source selection if ucDAO balance is greater than 0 */}
      {balances && (
        <div>
          <label className="mb-[8px] block text-[14px] font-medium text-[#0D0D0E]">
            Funds Source
          </label>
          <div className="space-y-[8px]">
            <label
              className={`flex items-center space-x-[8px] ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
              <input
                type="radio"
                name="source"
                value={FundsSource.OwnBalance}
                checked={source === FundsSource.OwnBalance}
                onChange={() => onSourceChange(FundsSource.OwnBalance)}
                disabled={disabled}
                className="h-[16px] w-[16px] cursor-pointer disabled:cursor-not-allowed"
              />
              <span className="text-[14px] text-[#0D0D0E]">Own Balance</span>
            </label>
            <label
              className={`flex items-center space-x-[8px] ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
              <input
                type="radio"
                name="source"
                value={FundsSource.ucDAO}
                checked={source === FundsSource.ucDAO}
                onChange={() => onSourceChange(FundsSource.ucDAO)}
                disabled={disabled}
                className="h-[16px] w-[16px] cursor-pointer disabled:cursor-not-allowed"
              />
              <span className="text-[14px] text-[#0D0D0E]">ucDAO</span>
            </label>
          </div>
        </div>
      )}

      {/* Warning for negative available balance */}
      {availableBalance !== undefined && availableBalance < 0n && (
        <div className="mt-[24px] rounded-[8px] bg-[#FEF3C7] p-[16px]">
          <div className="text-[14px] font-medium text-[#92400E]">
            Need to fill balance {formatEthDecimal(-availableBalance, 4)} ISLM
            for request creation
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-[8px] bg-[#FEE2E2] p-[12px]">
          <div className="text-[14px] font-medium text-[#DC2626]">{error}</div>
        </div>
      )}

      <div className="pt-[8px]">
        <Button
          variant={5}
          onClick={onSubmit}
          className="w-full"
          disabled={!isValid || isSubmitting || disabled}
          isLoading={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Participate in Waitlist'}
        </Button>
      </div>
    </div>
  );
}
