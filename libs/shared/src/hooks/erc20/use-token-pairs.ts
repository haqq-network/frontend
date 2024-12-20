import { useQuery } from '@tanstack/react-query';
import { useAccount, useChains } from 'wagmi';
import { useCosmosService } from '../../providers/cosmos-provider';

export function useTokenPairs(limit?: number) {
  const { getErc20TokenPairs } = useCosmosService();
  const chains = useChains();
  const { chain = chains[0] } = useAccount();

  return useQuery({
    queryKey: [chain.id, 'token-pairs', limit],
    queryFn: () => {
      return getErc20TokenPairs(limit);
    },
  });
}
