import { useQuery } from '@tanstack/react-query';
import { useAccount, useChains } from 'wagmi';
import { useCosmosService } from '../../providers/cosmos-provider';

export function useAccountInfoQuery(address: string | undefined) {
  const { getAccountInfo } = useCosmosService();
  const chains = useChains();
  const { chain = chains[0] } = useAccount();

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
