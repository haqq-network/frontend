'use client';

import { useQuery } from '@tanstack/react-query';

export interface Application {
  requestId: string;
  amount: string;
  author: string;
  source: number; // 0 for OwnBalance, 1 for ucDAO
  cancelled: boolean;
  valid: boolean;
  ready: boolean;
}

export interface ApplicationsListResponse {
  applications: Application[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

interface UseWaitlistApplicationsParams {
  address?: string;
  status?: 'active' | 'cancelled';
  page?: number;
  pageSize?: number;
}

/**
 * Hook to fetch user applications from backend API
 */
export function useWaitlistApplications({
  address,
  status,
  page = 1,
  pageSize = 50,
}: UseWaitlistApplicationsParams = {}) {
  return useQuery<ApplicationsListResponse>({
    queryKey: ['waitlist-applications', address, status, page, pageSize],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (address) {
        params.append('address', address);
      }
      if (status) {
        params.append('status', status);
      }
      params.append('page', page.toString());
      params.append('pageSize', pageSize.toString());

      const queryString = params.toString();
      const url = queryString
        ? `/api/waitlist/applications?${queryString}`
        : '/api/waitlist/applications';

      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch applications: ${response.status} ${errorText}`,
        );
      }

      return response.json();
    },
    enabled: !!address, // Only fetch if address is provided
    staleTime: 0, // Always refetch to get latest data
  });
}
