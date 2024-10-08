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
    return haqqZone;
  } else {
    throw new Error('Haqq zone not found');
  }
}

export function useStrideRates() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['redemptionRate'],
    queryFn: fetchRedemptionRate,
    refetchInterval: 10000,
  });

  return { data, isLoading, error };
}
