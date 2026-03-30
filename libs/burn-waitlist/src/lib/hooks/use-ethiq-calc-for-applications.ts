'use client';

import { useMemo } from 'react';
import { useReadContracts } from 'wagmi';
import { EthiqAbi } from '../abi/ethiq';
import { ETHIQ_PRECOMPILE_ADDRESS } from '../constants/ethiq-config';
import { WAITLIST_DEFAULT_CHAIN_ID } from '../constants/waitlist-config';
import type { EthiqApplication } from './use-ethiq-applications';

/**
 * Hook that uses multicall to batch `calculateForApplication` calls
 * for all active (non-cancelled, non-executed) ethiq applications.
 *
 * Returns a Map of applicationId -> { price, receiveAmount }.
 */
export function useEthiqCalcForApplications(
  applications: EthiqApplication[] | undefined,
  chainId: number | undefined,
  enabled: boolean,
) {
  const contracts = useMemo(() => {
    if (!enabled || !applications) {
      return [];
    }
    return applications
      .filter((app) => !app.is_canceled && !app.is_executed)
      .map((app) => ({
        address: ETHIQ_PRECOMPILE_ADDRESS,
        abi: EthiqAbi,
        functionName: 'calculateForApplication' as const,
        args: [BigInt(app.id)] as const,
        chainId: chainId ?? WAITLIST_DEFAULT_CHAIN_ID,
      }));
  }, [enabled, applications, chainId]);

  const { data: results } = useReadContracts({
    contracts,
    query: {
      enabled: contracts.length > 0,
    },
  });

  const calcMap = useMemo(() => {
    const map = new Map<string, { price: string; receiveAmount: string }>();
    if (!results || !applications) {
      return map;
    }
    const activeApps = applications.filter(
      (app) => !app.is_canceled && !app.is_executed,
    );
    activeApps.forEach((app, index) => {
      const result = results[index];
      if (result?.status === 'success') {
        const [estimatedHaqqAmount, , , pricePerUnit] = result.result as [
          bigint,
          bigint,
          bigint,
          string,
          `0x${string}`,
        ];
        map.set(app.id, {
          price: pricePerUnit,
          receiveAmount: estimatedHaqqAmount.toString(),
        });
      }
    });
    return map;
  }, [results, applications]);

  return calcMap;
}
