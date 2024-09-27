'use client';

import { useQuery } from '@tanstack/react-query';

const HAQQ_STRIDE_ID = 'haqq_11235-1';

async function fetchRedemptionRate() {
  const response = await fetch(
    'https://stride-api.polkachu.com/Stride-Labs/stride/stakeibc/host_zone',
  );
  const data = await response.json();

  const haqqZone = data.host_zone.find((zone: any) => {
    return zone.chain_id === HAQQ_STRIDE_ID;
  });

  if (haqqZone) {
    return haqqZone.redemption_rate;
  } else {
    throw new Error('Haqq zone not found');
  }
}

export function useStrideRates(address?: string) {
  const {
    data: redemptionRate,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['redemptionRate', address],
    queryFn: fetchRedemptionRate,
    refetchInterval: 10000,
    enabled: !!address,
  });

  return { redemptionRate, isLoading, error };
}
