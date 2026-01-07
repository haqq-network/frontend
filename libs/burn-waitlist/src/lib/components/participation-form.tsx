'use client';

import { useMemo } from 'react';
import { Button } from '@haqq/shell-ui-kit';
import { ModalInput } from '@haqq/shell-ui-kit';
import { FundsSource } from '../constants/waitlist-config';
import { formatEther } from 'viem';
import { WaitlistBalances } from './waitlist-balances';
import type { WaitlistBalancesResponse } from '../hooks/use-waitlist-balances';

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
}: ParticipationFormProps) {
  const formattedBalance = useMemo(() => {
    if (!availableBalance) {
      return '0';
    }
    // Handle negative balances
    if (availableBalance < 0n) {
      return `-${formatEther(-availableBalance)}`;
    }
    return formatEther(availableBalance);
  }, [availableBalance]);

  const balanceLabel = useMemo(() => {
    if (source === FundsSource.OwnBalance) {
      return 'Wallet Balance';
    }
    return 'Available Balance';
  }, [source]);

  return (
    <div className="space-y-[20px]">
      <WaitlistBalances balances={balances} />
      <div>
        <label className="mb-[8px] block text-[14px] font-[500] text-[#0D0D0E]">
          Amount
        </label>
        <ModalInput
          symbol="ISLM"
          value={amount ? Number(amount) : undefined}
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
                {balanceLabel}: {formattedBalance} ISLM (Insufficient)
              </span>
            ) : (
              <span className="text-[#6B7280]">
                {balanceLabel}: {formattedBalance} ISLM
              </span>
            )
          }
          isMaxButtonDisabled={!availableBalance || availableBalance <= 0n}
        />
      </div>

      {/* Only show Funds Source selection if ucDAO balance is greater than 0 */}
      {balances && BigInt(balances.ucdao) > 0n && (
        <div>
          <label className="mb-[8px] block text-[14px] font-[500] text-[#0D0D0E]">
            Funds Source
          </label>
          <div className="space-y-[8px]">
            <label className="flex cursor-pointer items-center space-x-[8px]">
              <input
                type="radio"
                name="source"
                value={FundsSource.OwnBalance}
                checked={source === FundsSource.OwnBalance}
                onChange={() => onSourceChange(FundsSource.OwnBalance)}
                className="h-[16px] w-[16px] cursor-pointer"
              />
              <span className="text-[14px] text-[#0D0D0E]">Own Balance</span>
            </label>
            <label className="flex cursor-pointer items-center space-x-[8px]">
              <input
                type="radio"
                name="source"
                value={FundsSource.ucDAO}
                checked={source === FundsSource.ucDAO}
                onChange={() => onSourceChange(FundsSource.ucDAO)}
                className="h-[16px] w-[16px] cursor-pointer"
              />
              <span className="text-[14px] text-[#0D0D0E]">ucDAO</span>
            </label>
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
          disabled={!isValid || isSubmitting}
          isLoading={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Participate in Waitlist'}
        </Button>
      </div>
    </div>
  );
}
