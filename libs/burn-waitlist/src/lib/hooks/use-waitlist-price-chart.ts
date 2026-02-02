'use client';

import { useQuery } from '@tanstack/react-query';
import { getBackendApiUrl } from '../constants/waitlist-config';

export interface PriceChartPoint {
  timestamp: number;
  price: number;
}

export interface PriceChartMeta {
  from: number;
  to: number;
  dataPoints: number;
  chartStart: number;
  chartEnd: number;
  granularity: string;
}

export interface PriceChartResponse {
  data: PriceChartPoint[];
  meta: PriceChartMeta;
}

export type PriceChartGranularity = 'event' | 'hour' | 'day';

interface UseWaitlistPriceChartParams {
  chainId?: number;
  from?: number;
  to?: number;
  limit?: number;
  granularity?: PriceChartGranularity;
}

/**
 * Hook to fetch price chart from backend API (GET /api/v1/price/chart).
 */
export function useWaitlistPriceChart({
  chainId,
  from,
  to,
  limit = 2000,
  granularity = 'event',
}: UseWaitlistPriceChartParams = {}) {
  return useQuery<PriceChartResponse>({
    queryKey: ['waitlist-price-chart', chainId, from, to, limit, granularity],
    queryFn: async () => {
      const apiUrl = getBackendApiUrl(chainId);
      const params = new URLSearchParams();
      if (from !== undefined) params.append('from', String(from));
      if (to !== undefined) params.append('to', String(to));
      params.append('limit', String(limit));
      params.append('granularity', granularity);
      const url = `${apiUrl}/api/v1/price/chart?${params.toString()}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          `Failed to fetch price chart: ${response.status} ${text}`,
        );
      }

      return response.json();
    },
    enabled: chainId !== undefined,
    staleTime: 60_000, // 1 minute
  });
}
