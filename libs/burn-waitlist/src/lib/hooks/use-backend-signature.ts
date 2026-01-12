'use client';

import { useCallback, useState } from 'react';
import { FundsSource, getBackendApiUrl } from '../constants/waitlist-config';

interface BackendSignatureResponse {
  signature: string;
  nonce?: string; // Nonce is returned but not needed by frontend
}

interface UseBackendSignatureReturn {
  getSignature: (
    userAddress: string,
    amount: bigint,
    source: FundsSource,
    chainId?: number,
  ) => Promise<`0x${string}`>;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook to get backend signature for waitlist request
 * Note: Backend manages nonce internally, frontend doesn't need to pass it
 */
export function useBackendSignature(): UseBackendSignatureReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getSignature = useCallback(
    async (
      userAddress: string,
      amount: bigint,
      source: FundsSource,
      chainId?: number,
    ): Promise<`0x${string}`> => {
      setIsLoading(true);
      setError(null);

      try {
        const apiUrl = getBackendApiUrl(chainId);
        const response = await fetch(`${apiUrl}/api/v1/signer/signature`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: userAddress,
            amount: amount.toString(),
            source: source,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to get signature: ${response.status} ${errorText}`,
          );
        }

        const data: BackendSignatureResponse = await response.json();
        return data.signature as `0x${string}`;
      } catch (err) {
        const error =
          err instanceof Error
            ? err
            : new Error('Failed to get backend signature');
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    getSignature,
    isLoading,
    error,
  };
}
