'use client';

import { useCallback, useState } from 'react';
import { getBackendApiUrl } from '../constants/waitlist-config';
import { FundsSource } from '../constants/waitlist-config';

interface BackendSignatureResponse {
  signature: string;
}

interface UseBackendSignatureReturn {
  getSignature: (
    userAddress: string,
    amount: bigint,
    source: FundsSource,
    nonce: bigint,
  ) => Promise<`0x${string}`>;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook to get backend signature for waitlist request
 */
export function useBackendSignature(): UseBackendSignatureReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getSignature = useCallback(
    async (
      userAddress: string,
      amount: bigint,
      source: FundsSource,
      nonce: bigint,
    ): Promise<`0x${string}`> => {
      setIsLoading(true);
      setError(null);

      try {
        const apiUrl = getBackendApiUrl();
        const response = await fetch(`${apiUrl}/api/v1/signature`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: userAddress,
            amount: amount.toString(),
            source: source,
            nonce: nonce.toString(),
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
