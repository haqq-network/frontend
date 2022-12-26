import { useQuery } from '@tanstack/react-query';
import { useCosmosService } from '../../providers/cosmos-provider';

export function useDistributionPoolQuery() {
  const { getDistributionPool } = useCosmosService();

  return useQuery(['distribution-pool'], getDistributionPool);
}
