import { useQuery } from '@tanstack/react-query';
import { useCosmosService } from './useCosmosService';

export function useAccountInfo(address: string) {
  const { getAccountInfo } = useCosmosService();
  const { data } = useQuery(['account', address], () => {
    return getAccountInfo(address);
  });

  return data;
}
