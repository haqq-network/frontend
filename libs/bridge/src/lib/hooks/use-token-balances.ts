'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { fetchAllTokenBalances, TokenBalance } from '../services/explorer-api';

interface UseTokenBalancesReturn {
  tokens: TokenBalance[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage user token balances from HAQQ Explorer API
 */
export function useTokenBalances(): UseTokenBalancesReturn {
  const { address, chain } = useAccount();
  const [tokens, setTokens] = useState<TokenBalance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTokens = useCallback(async () => {
    if (!address || !chain) {
      console.log('No address or chain available, clearing tokens');
      setTokens([]);
      return;
    }

    console.log(
      `Starting token balance fetch for ${address} on chain ${chain.id}`,
    );
    setIsLoading(true);
    setError(null);

    try {
      const tokenBalances = await fetchAllTokenBalances(address, chain.id);
      console.log('Token balances:', tokenBalances);
      console.log(
        `Successfully fetched ${tokenBalances.length} tokens in hook`,
      );
      setTokens(tokenBalances);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch token balances';
      console.error('Error in useTokenBalances hook:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [address, chain]);

  // Fetch tokens when address or chain changes
  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  return {
    tokens,
    isLoading,
    error,
    refetch: fetchTokens,
  };
}
