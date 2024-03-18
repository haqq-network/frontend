import { useQuery } from '@tanstack/react-query';
import { useNetwork } from 'wagmi';
import { useCosmosService } from '../../providers/cosmos-provider';
import { useSupportedChains } from '../../providers/wagmi-provider';

export function useAccountInfoQuery(address: string | undefined) {
  const { getAccountInfo } = useCosmosService();
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();

  return useQuery({
    queryKey: [chain.id, 'account', address],
    queryFn: async () => {
      if (!address) {
        return null;
      }

      return await getAccountInfo(address);
    },
  });
}
