'use client';

import { ParticipationForm } from './participation-form';
import { ParticipationFormSkeleton } from './participation-form-skeleton';
import type { WaitlistBalancesResponse } from '../hooks/use-waitlist-balances';
import type { WaitlistFormState } from '../hooks/use-waitlist-form';
import type { FundsSource } from '../constants/waitlist-config';

export interface WaitlistFormSectionProps {
  formState: WaitlistFormState;
  availableBalance?: bigint;
  waitlistBalances?: WaitlistBalancesResponse;
  isLoadingBalances: boolean;
  currentPriceAtto?: string;
  formattedAmount?: bigint;
  isValid: boolean;
  isSubmitting: boolean;
  errorMessage?: string;
  disabled: boolean;
  onAmountChange: (amount: string) => void;
  onSourceChange: (source: FundsSource) => void;
  onMaxClick: () => void;
  onSubmit: () => void;
}

export function WaitlistFormSection({
  formState,
  availableBalance,
  waitlistBalances,
  isLoadingBalances,
  currentPriceAtto,
  formattedAmount,
  isValid,
  isSubmitting,
  errorMessage,
  disabled,
  onAmountChange,
  onSourceChange,
  onMaxClick,
  onSubmit,
}: WaitlistFormSectionProps) {
  return (
    <div>
      <h2 className="text-haqq-black mb-[16px] text-[18px] font-semibold">
        Participate in Waitlist
      </h2>
      {isLoadingBalances && !waitlistBalances ? (
        <ParticipationFormSkeleton />
      ) : (
        <ParticipationForm
          amount={formState.amount}
          source={formState.source}
          availableBalance={availableBalance}
          balances={waitlistBalances}
          currentPriceAtto={currentPriceAtto}
          formattedAmount={formattedAmount}
          onAmountChange={onAmountChange}
          onSourceChange={onSourceChange}
          onMaxClick={onMaxClick}
          onSubmit={onSubmit}
          isValid={
            isValid &&
            formattedAmount !== undefined &&
            formattedAmount <= (availableBalance || 0n)
          }
          isSubmitting={isSubmitting}
          error={errorMessage}
          amountError={formState.errors.amount}
          disabled={disabled}
        />
      )}
    </div>
  );
}
