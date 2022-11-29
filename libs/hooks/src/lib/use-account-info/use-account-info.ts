import { useCosmosService } from '@haqq/providers';
import { useQuery } from '@tanstack/react-query';

export function useAccountInfoQuery(address: string) {
  const { getAccountInfo } = useCosmosService();
  const { data } = useQuery(['account', address], () => {
    return getAccountInfo(address);
  });

  return data;
}
