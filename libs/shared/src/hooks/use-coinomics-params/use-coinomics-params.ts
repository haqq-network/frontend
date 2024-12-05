import { useQuery } from '@tanstack/react-query';
import { useAccount, useChains } from 'wagmi';
import { useCosmosService } from '../../providers/cosmos-provider';

export function useCoinomicsParams() {
  const { getCoinomicsParams } = useCosmosService();
  const chains = useChains();
  const { chain = chains[0] } = useAccount();

  return useQuery({
    queryKey: [chain.id, 'coinomics-params'],
    queryFn: async () => {
      return await getCoinomicsParams();
    },
  });
}
