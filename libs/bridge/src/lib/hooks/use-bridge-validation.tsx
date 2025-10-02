'use client';

import React, { useMemo, ReactNode } from 'react';
import { useTranslate } from '@tolgee/react';

export interface Token {
  symbol: string;
  address: string;
  name?: string;
  balance?: string;
  decimals?: number;
  formattedBalance?: number;
}

export interface UseBridgeValidationParams {
  isConnected: boolean;
  selectedToken: Token | null;
  bridgeAmount: number | undefined;
  availableBalance: number;
  isChainMismatch: boolean;
  isCheckingRemoteToken: boolean;
  formatNumber: (num: number) => string;
}

export interface UseBridgeValidationReturn {
  canBridge: boolean;
  amountHint: ReactNode;
  isInsufficientBalance: boolean;
}

/**
 * Hook to manage bridge validation logic
 * Provides validation state and user-friendly hints for the bridge form
 */
export function useBridgeValidation({
  isConnected,
  selectedToken,
  bridgeAmount,
  availableBalance,
  isChainMismatch,
  isCheckingRemoteToken,
  formatNumber,
}: UseBridgeValidationParams): UseBridgeValidationReturn {
  const { t } = useTranslate('common');

  // Check if user can proceed with bridge operation
  const canBridge = useMemo(() => {
    return (
      isConnected &&
      selectedToken &&
      bridgeAmount !== undefined &&
      bridgeAmount > 0 &&
      bridgeAmount <= availableBalance &&
      !isChainMismatch &&
      !isCheckingRemoteToken
    );
  }, [
    isConnected,
    selectedToken,
    bridgeAmount,
    availableBalance,
    isChainMismatch,
    isCheckingRemoteToken,
  ]);

  // Check if balance is insufficient
  const isInsufficientBalance = useMemo(() => {
    return bridgeAmount !== undefined && bridgeAmount > availableBalance;
  }, [bridgeAmount, availableBalance]);

  // Generate user-friendly hint based on current state
  const amountHint = useMemo(() => {
    if (!bridgeAmount) {
      return (
        <span className="text-[#0D0D0E80]">
          Available: {formatNumber(availableBalance)}{' '}
          {selectedToken?.symbol || 'ETH'}
        </span>
      );
    }

    if (bridgeAmount > availableBalance) {
      return (
        <span className="text-[#EC5728]">
          {t('insufficient-balance', 'Insufficient balance')}
        </span>
      );
    }

    return (
      <span className="text-[#0D0D0E80]">
        Available: {formatNumber(availableBalance)}{' '}
        {selectedToken?.symbol || 'ETH'}
      </span>
    );
  }, [bridgeAmount, availableBalance, selectedToken, formatNumber, t]);

  return {
    canBridge: canBridge || false,
    amountHint,
    isInsufficientBalance,
  };
}
