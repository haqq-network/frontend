'use client';

import { useQuery } from '@tanstack/react-query';
import { getBackendApiUrl } from '../constants/waitlist-config';

export interface WaitlistGlobalStats {
  totalCount: number;
  totalAmount: string;
}

interface UseWaitlistGlobalStatsParams {
  chainId?: number;
  /** When false, the query does not run (e.g. when user is connected and contract state is used) */
  enabled?: boolean;
}

/**
 * Fetches global waitlist stats (total applications count and total amount) from backend API.
 * Used for anonymous users who don't have a connected wallet (no RPC/contract read).
 */
export function useWaitlistGlobalStats({
  chainId,
  enabled = true,
}: UseWaitlistGlobalStatsParams = {}) {
  return useQuery<WaitlistGlobalStats>({
    queryKey: ['waitlist-global-stats', chainId],
    queryFn: async () => {
      const apiUrl = getBackendApiUrl(chainId);

      const [applicationsRes, priceRes] = await Promise.all([
        fetch(`${apiUrl}/api/v1/applications?page=1&pageSize=1`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
        }),
        fetch(`${apiUrl}/api/v1/price/current`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
        }),
      ]);

      let totalCount = 0;
      if (applicationsRes.ok) {
        const applicationsData = await applicationsRes.json();
        totalCount = applicationsData.total ?? 0;
      }

      let totalAmount = '0';
      if (priceRes.ok && priceRes.status !== 503) {
        const priceData = await priceRes.json();
        totalAmount = priceData.totalActiveAmount ?? '0';
      }

      return { totalCount, totalAmount };
    },
    enabled: enabled,
    staleTime: 30_000,
  });
}
