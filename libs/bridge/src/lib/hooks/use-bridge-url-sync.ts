'use client';

import { useEffect } from 'react';

export interface Token {
  symbol: string;
  address: string;
  name?: string;
  balance?: string;
  decimals?: number;
  formattedBalance?: number;
}

export interface UseBridgeUrlSyncParams {
  selectedToken: Token | null;
  chainId: number | undefined;
  targetChainId: number;
  bridgeAmount: number | undefined;
  updateUrlState: (params: {
    tokenIn?: string;
    chainIn?: number;
    chainOut?: number;
    amount?: string;
  }) => void;
}

/**
 * Hook to synchronize bridge state with URL parameters
 * Automatically updates URL when bridge state changes
 */
export function useBridgeUrlSync({
  selectedToken,
  chainId,
  targetChainId,
  bridgeAmount,
  updateUrlState,
}: UseBridgeUrlSyncParams): void {
  useEffect(() => {
    if (selectedToken && chainId && bridgeAmount) {
      updateUrlState({
        tokenIn: selectedToken.address,
        chainIn: chainId,
        chainOut: targetChainId,
        amount: bridgeAmount.toString(),
      });
    }
  }, [selectedToken, chainId, targetChainId, bridgeAmount, updateUrlState]);
}
