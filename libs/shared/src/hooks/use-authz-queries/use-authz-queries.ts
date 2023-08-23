import { useQuery } from '@tanstack/react-query';
import { useCosmosService } from '../../providers/cosmos-provider';
import { useNetwork } from 'wagmi';

export function useAuthzGrantsQuery(granter: string, grantee: string) {
  const { chain } = useNetwork();
  const { getAuthzGrants } = useCosmosService();

  return useQuery(
    [chain?.id, 'grants', granter, grantee],
    async () => {
      return await getAuthzGrants(granter, grantee);
    },
    {
      refetchOnWindowFocus: false,
    },
  );
}

export function useAuthzGranterGrants(granter: string) {
  const { chain } = useNetwork();
  const { getAuthzGranterGrants } = useCosmosService();

  return useQuery(
    [chain?.id, 'grants-granter', granter],
    async () => {
      return await getAuthzGranterGrants(granter);
    },
    {
      refetchOnWindowFocus: false,
    },
  );
}

export function useAuthzGranteeGrants(grantee: string) {
  const { chain } = useNetwork();
  const { getAuthzGranteeGrants } = useCosmosService();

  return useQuery(
    [chain?.id, 'grants-grantee', grantee],
    async () => {
      return await getAuthzGranteeGrants(grantee);
    },
    {
      refetchOnWindowFocus: false,
    },
  );
}
