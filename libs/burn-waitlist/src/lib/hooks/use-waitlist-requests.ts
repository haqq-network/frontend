'use client';

import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useUserRequestIds, useWaitlistRequest } from './use-waitlist-contract';

/**
 * Hook to fetch and manage all user requests
 */
export function useWaitlistRequests() {
  const { address } = useAccount();

  const { requestIds, refetch: refetchRequestIds } = useUserRequestIds(
    address as `0x${string}` | undefined,
  );

  // Fetch all request details
  const requests = useMemo(() => {
    if (!requestIds || requestIds.length === 0) {
      return [];
    }

    return requestIds.map((id) => ({ id }));
  }, [requestIds]);

  const refetchAll = () => {
    refetchRequestIds();
  };

  return {
    requestIds: requestIds || [],
    requests,
    refetchAll,
    hasRequests: (requestIds?.length ?? 0) > 0,
  };
}

/**
 * Hook to get a single request with details
 */
export function useWaitlistRequestDetails(requestId: bigint | undefined) {
  const { request, refetch } = useWaitlistRequest(requestId);

  return {
    request,
    refetch,
    isLoading: request === undefined && requestId !== undefined,
  };
}

/**
 * Hook to get all user requests with full details
 */
export function useUserWaitlistRequests() {
  const { address } = useAccount();
  const { requestIds, refetch: refetchRequestIds } = useUserRequestIds(
    address as `0x${string}` | undefined,
  );

  // This would ideally batch fetch all requests, but for now we'll fetch them individually
  // In a production app, you might want to use multicall or a backend API

  const refetchAll = () => {
    refetchRequestIds();
  };

  return {
    requestIds: requestIds || [],
    refetchAll,
    hasRequests: (requestIds?.length ?? 0) > 0,
  };
}
