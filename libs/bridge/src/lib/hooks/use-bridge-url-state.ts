'use client';

import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export interface BridgeUrlState {
  tokenIn?: string;
  tokenOut?: string;
  chainIn?: number;
  chainOut?: number;
  amount?: string;
}

export interface UseBridgeUrlStateReturn {
  urlState: BridgeUrlState;
  updateUrlState: (newState: Partial<BridgeUrlState>) => void;
  clearUrlState: () => void;
  buildBridgeUrl: (state: Partial<BridgeUrlState>) => string;
  buildDeploymentUrl: (token: string, targetChainId: number) => string;
}

/**
 * Hook to manage bridge state in URL parameters for shareable URLs
 */
export function useBridgeUrlState(): UseBridgeUrlStateReturn {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse current URL state
  const urlState = useMemo((): BridgeUrlState => {
    const tokenIn = searchParams.get('tokenIn') || undefined;
    const tokenOut = searchParams.get('tokenOut') || undefined;
    const chainInParam = searchParams.get('chainIn');
    const chainOutParam = searchParams.get('chainOut');
    const amount = searchParams.get('amount') || undefined;

    return {
      tokenIn,
      tokenOut,
      chainIn: chainInParam ? parseInt(chainInParam, 10) : undefined,
      chainOut: chainOutParam ? parseInt(chainOutParam, 10) : undefined,
      amount,
    };
  }, [searchParams]);

  // Update URL state
  const updateUrlState = useCallback(
    (newState: Partial<BridgeUrlState>) => {
      const params = new URLSearchParams(searchParams);

      // Update or remove parameters based on newState
      Object.entries(newState).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.set(key, value.toString());
        } else {
          params.delete(key);
        }
      });

      // Navigate with new params
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      router.replace(newUrl);
    },
    [searchParams, router],
  );

  // Clear all URL state
  const clearUrlState = useCallback(() => {
    router.replace(window.location.pathname);
  }, [router]);

  // Build bridge URL with state
  const buildBridgeUrl = useCallback((state: Partial<BridgeUrlState>) => {
    const params = new URLSearchParams();

    Object.entries(state).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, value.toString());
      }
    });

    const queryString = params.toString();
    return `/bridge${queryString ? `?${queryString}` : ''}`;
  }, []);

  // Build deployment URL with token and chain info
  const buildDeploymentUrl = useCallback(
    (token: string, targetChainId: number) => {
      const params = new URLSearchParams();
      params.set('token', token);
      params.set('targetChain', targetChainId.toString());

      // Preserve current bridge state for return
      const currentState = urlState;
      if (currentState.tokenIn)
        params.set('returnTokenIn', currentState.tokenIn);
      if (currentState.tokenOut)
        params.set('returnTokenOut', currentState.tokenOut);
      if (currentState.chainIn)
        params.set('returnChainIn', currentState.chainIn.toString());
      if (currentState.chainOut)
        params.set('returnChainOut', currentState.chainOut.toString());
      if (currentState.amount) params.set('returnAmount', currentState.amount);

      return `/bridge/deploy-token?${params.toString()}`;
    },
    [urlState],
  );

  return {
    urlState,
    updateUrlState,
    clearUrlState,
    buildBridgeUrl,
    buildDeploymentUrl,
  };
}
