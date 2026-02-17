'use client';

import { useQuery } from '@tanstack/react-query';
import { getBackendApiUrl } from '../constants/waitlist-config';

export interface PriceCurrentResponse {
  /** Price tier value (cost per token) - may be number or string for large atto values */
  currentPrice: number | string;
  totalActiveAmount: string;
}

interface UseWaitlistPriceParams {
  chainId?: number;
}

/**
 * Hook to fetch current price from backend API (GET /api/v1/price/current).
 * Price is the cost per token for the next application (price tier value).
 * totalActiveAmount is sum of all active applications in atto.
 */
export function useWaitlistPrice({ chainId }: UseWaitlistPriceParams = {}) {
  return useQuery<PriceCurrentResponse>({
    queryKey: ['waitlist-price', chainId],
    queryFn: async () => {
      const apiUrl = getBackendApiUrl(chainId);
      const response = await fetch(`${apiUrl}/api/v1/price/current`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (response.status === 503) {
        throw new Error('Price cache not available');
      }
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to fetch price: ${response.status} ${text}`);
      }

      return response.json();
    },
    enabled: chainId !== undefined,
    staleTime: 30_000, // 30 seconds
  });
}
