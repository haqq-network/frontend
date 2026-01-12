'use client';

import { useMemo } from 'react';
import { Button } from '@haqq/shell-ui-kit';
import { ModalInput } from '@haqq/shell-ui-kit';
import { FundsSource } from '../constants/waitlist-config';
import { WaitlistBalances } from './waitlist-balances';
import type { WaitlistBalancesResponse } from '../hooks/use-waitlist-balances';
import { formatEthDecimal } from '@haqq/shell-shared';

export interface ParticipationFormProps {
  amount: string;
  source: FundsSource;
  availableBalance?: bigint;
  balances?: WaitlistBalancesResponse;
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

  return (
    <div className="space-y-[20px]">
      <WaitlistBalances balances={balances} />
      <div>
        <label className="mb-[8px] block text-[14px] font-[500] text-[#0D0D0E]">
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
      </div>

      {/* Only show Funds Source selection if ucDAO balance is greater than 0 */}
      {balances && (
        <div>
          <label className="mb-[8px] block text-[14px] font-[500] text-[#0D0D0E]">
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
          <div className="text-[14px] font-[500] text-[#92400E]">
            Need to fill balance {formatEthDecimal(-availableBalance, 4)} ISLM
            for request creation
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-[8px] bg-[#FEE2E2] p-[12px]">
          <div className="text-[14px] font-[500] text-[#DC2626]">{error}</div>
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
