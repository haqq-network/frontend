'use client';

import { useState, useCallback, useMemo } from 'react';
import { parseEther, formatEther } from 'viem';
import { FundsSource } from '../constants/waitlist-config';

export interface WaitlistFormState {
  amount: string;
  source: FundsSource;
  errors: {
    amount?: string;
  };
}

interface UseWaitlistFormParams {
  availableBalance?: bigint;
  onSubmit?: (amount: bigint, source: FundsSource) => Promise<void>;
}

interface UseWaitlistFormReturn {
  formState: WaitlistFormState;
  setAmount: (amount: string) => void;
  setSource: (source: FundsSource) => void;
  handleMaxClick: () => void;
  handleSubmit: () => Promise<void>;
  isValid: boolean;
  formattedAmount: bigint | undefined;
}

/**
 * Hook to manage waitlist participation form state
 * Note: availableBalance should be recalculated externally when source changes
 */
export function useWaitlistForm({
  availableBalance,
  onSubmit,
}: UseWaitlistFormParams = {}): UseWaitlistFormReturn {
  const [formState, setFormState] = useState<WaitlistFormState>({
    amount: '',
    source: FundsSource.OwnBalance,
    errors: {},
  });

  const setAmount = useCallback((amount: string) => {
    setFormState((prev) => ({
      ...prev,
      amount,
      errors: {
        ...prev.errors,
        amount: undefined,
      },
    }));
  }, []);

  const setSource = useCallback((source: FundsSource) => {
    setFormState((prev) => ({
      ...prev,
      source,
      errors: {
        ...prev.errors,
      },
    }));
  }, []);

  const handleMaxClick = useCallback(() => {
    if (availableBalance) {
      const formatted = formatEther(availableBalance);
      setAmount(formatted);
    }
  }, [availableBalance, setAmount]);

  const formattedAmount = useMemo(() => {
    if (!formState.amount || formState.amount === '') {
      return undefined;
    }

    try {
      const parsed = parseFloat(formState.amount);
      if (isNaN(parsed) || parsed <= 0) {
        return undefined;
      }
      return parseEther(formState.amount);
    } catch {
      return undefined;
    }
  }, [formState.amount]);

  const validate = useCallback((): boolean => {
    const errors: WaitlistFormState['errors'] = {};

    if (!formState.amount || formState.amount === '') {
      errors.amount = 'Amount is required';
    } else {
      const parsed = parseFloat(formState.amount);
      if (isNaN(parsed) || parsed <= 0) {
        errors.amount = 'Amount must be greater than 0';
      } else if (!availableBalance || availableBalance < 0n) {
        errors.amount = 'Insufficient available balance';
      } else if (formattedAmount && formattedAmount > availableBalance) {
        errors.amount = 'Insufficient balance';
      }
    }

    setFormState((prev) => ({
      ...prev,
      errors,
    }));

    return Object.keys(errors).length === 0;
  }, [formState.amount, formattedAmount, availableBalance]);

  const handleSubmit = useCallback(async () => {
    if (!validate()) {
      return;
    }

    if (!formattedAmount) {
      return;
    }

    if (onSubmit) {
      await onSubmit(formattedAmount, formState.source);
    }
  }, [validate, formattedAmount, formState.source, onSubmit]);

  const isValid = useMemo(() => {
    // If no amount entered, form is invalid
    if (!formState.amount || formState.amount === '') {
      return false;
    }

    // Try to parse the amount
    let parsed: number;
    try {
      parsed = parseFloat(formState.amount);
      if (isNaN(parsed) || parsed <= 0) {
        return false;
      }
    } catch {
      return false;
    }

    // If availableBalance is undefined, we can't validate (might be loading)
    if (availableBalance === undefined) {
      return false;
    }

    // If availableBalance is negative or zero, form is invalid
    if (availableBalance <= 0n) {
      return false;
    }

    // Check if formatted amount exceeds available balance
    if (formattedAmount && formattedAmount > availableBalance) {
      return false;
    }

    return true;
  }, [formState.amount, formattedAmount, availableBalance]);

  return {
    formState,
    setAmount,
    setSource,
    handleMaxClick,
    handleSubmit,
    isValid,
    formattedAmount,
  };
}
