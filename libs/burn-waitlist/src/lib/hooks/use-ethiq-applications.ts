'use client';

import { useQuery } from '@tanstack/react-query';
import { getCosmosRestUrl } from '../constants/waitlist-config';

export interface EthiqCoin {
  denom: string;
  amount: string;
}

export interface EthiqApplication {
  id: string;
  from_address: string;
  to_address: string;
  source: 'SOURCE_OF_FUNDS_BANK' | 'SOURCE_OF_FUNDS_UCDAO';
  burn_amount: EthiqCoin;
  burned_before_amount: EthiqCoin;
  is_executed: boolean;
}

export interface EthiqApplicationsResponse {
  applications: EthiqApplication[];
  pagination: {
    next_key: string | null;
    total: string;
  };
}

export interface EthiqCalculateResponse {
  estimated_haqq_amount: string;
  supply_before: string;
  supply_after: string;
  average_price: string;
}

export interface EthiqCalculateForApplicationResponse {
  estimated_haqq_amount: string;
  supply_before: string;
  supply_after: string;
  average_price: string;
  to_address: string;
}

export interface EthiqTotalBurnedResponse {
  total_burned: EthiqCoin;
  total_burned_from_applications: EthiqCoin;
}

interface UseEthiqApplicationsParams {
  chainId?: number;
  enabled?: boolean;
}

/**
 * Hook to fetch all applications from the ethiq cosmos REST endpoint
 */
export function useEthiqApplications({
  chainId,
  enabled = true,
}: UseEthiqApplicationsParams = {}) {
  return useQuery<EthiqApplicationsResponse>({
    queryKey: ['ethiq-applications', chainId],
    queryFn: async () => {
      const baseUrl = getCosmosRestUrl(chainId);
      const url = `${baseUrl}/haqq/ethiq/v1/get-applications?pagination.count_total=true`;

      const response = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch ethiq applications: ${response.status} ${errorText}`,
        );
      }

      return response.json();
    },
    enabled,
    staleTime: 0,
  });
}

interface UseEthiqSenderApplicationsParams {
  address?: string;
  chainId?: number;
  enabled?: boolean;
}

/**
 * Hook to fetch applications for a specific sender from the ethiq cosmos REST endpoint
 */
export function useEthiqSenderApplications({
  address,
  chainId,
  enabled = true,
}: UseEthiqSenderApplicationsParams = {}) {
  console.log('[useEthiqSenderApplications] address', address);
  console.log('[useEthiqSenderApplications] chainId', chainId);
  console.log('[useEthiqSenderApplications] enabled', enabled);
  return useQuery<EthiqApplicationsResponse>({
    queryKey: ['ethiq-sender-applications', address, chainId],
    queryFn: async () => {
      const baseUrl = getCosmosRestUrl(chainId);
      const url = `${baseUrl}/haqq/ethiq/v1/get-senders-applications/${address}?pagination.count_total=true`;

      console.log('url', url);
      const response = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch sender applications: ${response.status} ${errorText}`,
        );
      }

      return response.json();
    },
    enabled: enabled && !!address,
    staleTime: 0,
  });
}

interface UseEthiqCalculateRestParams {
  /** Amount in aISLM (e.g. "4000000000000000000000") */
  amount?: string;
  chainId?: number;
  enabled?: boolean;
}

/**
 * Hook to fetch calculate from the ethiq cosmos REST endpoint
 */
export function useEthiqCalculateRest({
  amount,
  chainId,
  enabled = true,
}: UseEthiqCalculateRestParams = {}) {
  return useQuery<EthiqCalculateResponse>({
    queryKey: ['ethiq-calculate', amount, chainId],
    queryFn: async () => {
      const baseUrl = getCosmosRestUrl(chainId);
      const url = `${baseUrl}/haqq/ethiq/v1/calculate/${amount}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch calculate: ${response.status} ${errorText}`,
        );
      }

      return response.json();
    },
    enabled: enabled && !!amount,
    staleTime: 0,
    retry: false,
  });
}

interface UseEthiqCalculateForApplicationParams {
  applicationId?: string;
  chainId?: number;
  enabled?: boolean;
}

/**
 * Hook to fetch calculate-for-application from the ethiq cosmos REST endpoint
 */
export function useEthiqCalculateForApplicationRest({
  applicationId,
  chainId,
  enabled = true,
}: UseEthiqCalculateForApplicationParams = {}) {
  return useQuery<EthiqCalculateForApplicationResponse>({
    queryKey: ['ethiq-calculate-for-application', applicationId, chainId],
    queryFn: async () => {
      const baseUrl = getCosmosRestUrl(chainId);
      const url = `${baseUrl}/haqq/ethiq/v1/calculate-for-application/${applicationId}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch calculate for application: ${response.status} ${errorText}`,
        );
      }

      return response.json();
    },
    enabled: enabled && applicationId !== undefined,
    staleTime: 0,
  });
}

interface UseEthiqTotalBurnedParams {
  chainId?: number;
  enabled?: boolean;
}

/**
 * Hook to fetch total burned amounts from the ethiq cosmos REST endpoint
 */
export function useEthiqTotalBurned({
  chainId,
  enabled = true,
}: UseEthiqTotalBurnedParams = {}) {
  return useQuery<EthiqTotalBurnedResponse>({
    queryKey: ['ethiq-total-burned', chainId],
    queryFn: async () => {
      const baseUrl = getCosmosRestUrl(chainId);
      const url = `${baseUrl}/haqq/ethiq/v1/total_burned`;

      const response = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch total burned: ${response.status} ${errorText}`,
        );
      }

      return response.json();
    },
    enabled,
    staleTime: 30000,
  });
}
