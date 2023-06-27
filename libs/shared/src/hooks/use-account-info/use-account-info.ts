import { useQuery } from '@tanstack/react-query';
import { useCosmosService } from '../../providers/cosmos-provider';
import { useNetwork } from 'wagmi';

export function useAccountInfoQuery(address: string) {
  const { getAccountInfo } = useCosmosService();
  const { chain } = useNetwork();

  return useQuery([chain?.id, 'account', address], () => {
    return getAccountInfo(address);
  });
}
