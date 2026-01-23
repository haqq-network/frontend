'use client';

import { useQuery } from '@tanstack/react-query';
import { getBackendApiUrl } from '../constants/waitlist-config';

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
 * @param userAddress - User wallet address
 * @param chainId - Optional chain ID to determine which backend URL to use
 */
export function useWaitlistBalances(
  userAddress: string | undefined,
  chainId?: number,
) {
  return useQuery<WaitlistBalancesResponse>({
    queryKey: ['waitlist-balances', userAddress, chainId],
    queryFn: async () => {
      if (!userAddress) {
        throw new Error('User address is required');
      }

      const apiUrl = getBackendApiUrl(chainId);
      const response = await fetch(`${apiUrl}/api/v1/balances/${userAddress}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch balances: ${response.status} ${errorText}`,
        );
      }

      return response.json();
    },
    enabled: !!userAddress,
    staleTime: 0, // Always refetch to get latest data
  });
}
