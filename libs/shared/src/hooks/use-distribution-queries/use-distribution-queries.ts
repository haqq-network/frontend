import { useQuery } from '@tanstack/react-query';
import { useCosmosService } from '../../providers/cosmos-provider';
import { useNetwork } from 'wagmi';

export function useDistributionPoolQuery() {
  const { getDistributionPool } = useCosmosService();
  const { chain } = useNetwork();

  return useQuery([chain?.id, 'distribution-pool'], getDistributionPool);
}
