'use client';

import { useQuery } from '@tanstack/react-query';
import { getCosmosRestUrl } from '../constants/waitlist-config';

export interface LiquidDenomSchedule {
  cliff_date: string;
  start_date: string;
  end_date: string;
  amount: string;
}

export interface LiquidDenomInfo {
  denom: string;
  display_denom: string;
  original_denom: string;
  liquidity_provider: string;
  end: string;
  lockup_periods: LiquidDenomSchedule[];
  vesting_periods: LiquidDenomSchedule[];
}

export interface LiquidDenomResponse {
  denom: LiquidDenomInfo;
}

export interface BankBalance {
  denom: string;
  amount: string;
}

export interface BankBalancesResponse {
  balances: BankBalance[];
  pagination: {
    next_key: string | null;
    total: string;
  };
}

interface UseLiquidDenomInfoParams {
  denom?: string;
  chainId?: number;
}

/**
 * Hook to fetch liquid denom info from the liquidvesting REST endpoint
 */
export function useLiquidDenomInfo({
  denom,
  chainId,
}: UseLiquidDenomInfoParams = {}) {
  return useQuery<LiquidDenomResponse>({
    queryKey: ['liquid-denom-info', denom, chainId],
    queryFn: async () => {
      const baseUrl = getCosmosRestUrl(chainId);
      const url = `${baseUrl}/haqq/liquidvesting/v1/denom?denom=${encodeURIComponent(denom!)}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch liquid denom info: ${response.status} ${errorText}`,
        );
      }

      return response.json();
    },
    enabled: !!denom,
    staleTime: 30000,
  });
}

interface UseLiquidTokenBalancesParams {
  haqqAddress?: string;
  chainId?: number;
}

/**
 * Hook to fetch all liquid tokens (aLIQUID*) at the connected address
 * Fetches bank balances and filters for liquid vesting denoms
 */
export function useLiquidTokenBalances({
  haqqAddress,
  chainId,
}: UseLiquidTokenBalancesParams = {}) {
  return useQuery<BankBalance[]>({
    queryKey: ['liquid-token-balances', haqqAddress, chainId],
    queryFn: async () => {
      const baseUrl = getCosmosRestUrl(chainId);
      const url = `${baseUrl}/cosmos/bank/v1beta1/balances/${haqqAddress}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch bank balances: ${response.status} ${errorText}`,
        );
      }

      const data: BankBalancesResponse = await response.json();

      // Filter for liquid vesting tokens (denoms starting with "aLIQUID")
      return data.balances.filter((balance) => {
        return balance.denom.startsWith('aLIQUID');
      });
    },
    enabled: !!haqqAddress,
    staleTime: 10000,
  });
}
