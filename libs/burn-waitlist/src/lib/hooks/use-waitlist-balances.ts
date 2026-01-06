'use client';

import { useQuery } from '@tanstack/react-query';

export interface WaitlistBalancesResponse {
  address: string;
  balance: string;
  delegations: string;
  rewards: string;
  unbonding_delegations: string;
  ucdao: string;
  total_balance: string;
  available_balance: string;
  available_ucdao_balance: string;
}

/**
 * Hook to fetch user balances from backend API
 */
export function useWaitlistBalances(userAddress: string | undefined) {
  return useQuery<WaitlistBalancesResponse>({
    queryKey: ['waitlist-balances', userAddress],
    queryFn: async () => {
      if (!userAddress) {
        throw new Error('User address is required');
      }

      const response = await fetch(`/api/waitlist/balances/${userAddress}`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch balances: ${response.status} ${errorText}`,
        );
      }

      return response.json();
    },
    enabled: !!userAddress,
    staleTime: 30000, // Cache for 30 seconds
  });
}
