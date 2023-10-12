import { useQuery } from '@tanstack/react-query';
import { useCosmosService } from '../../providers/cosmos-provider';
import { useNetwork } from 'wagmi';
import { useSupportedChains } from '../../providers/wagmi-provider';

export function useDistributionPoolQuery() {
  const { getDistributionPool } = useCosmosService();
  const { chain } = useNetwork();
  const chains = useSupportedChains();
  const chainId = chain?.id ?? chains[0].id;

  return useQuery([chainId, 'distribution-pool'], getDistributionPool);
}
