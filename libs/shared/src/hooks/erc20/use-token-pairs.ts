import { useQuery } from '@tanstack/react-query';
import { useNetwork } from 'wagmi';
import { useCosmosService } from '../../providers/cosmos-provider';
import { useSupportedChains } from '../../providers/wagmi-provider';

export function useTokenPairs() {
  const { getErc20TokenPairs } = useCosmosService();
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();

  return useQuery({
    queryKey: [chain.id, 'token-pairs'],
    queryFn: getErc20TokenPairs,
  });
}
