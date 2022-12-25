import { useQuery } from '@tanstack/react-query';
import { useCosmosService } from '../../providers/cosmos-provider';

export function useAccountInfoQuery(address: string) {
  const { getAccountInfo } = useCosmosService();

  return useQuery(['account', address], () => {
    return getAccountInfo(address);
  });
}
