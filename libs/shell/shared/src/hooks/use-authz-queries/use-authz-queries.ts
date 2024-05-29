import { useQuery } from '@tanstack/react-query';
import { useAccount, useChains } from 'wagmi';
import { useCosmosService } from '../../providers/cosmos-provider';

export function useAuthzGrantsQuery(granter: string, grantee: string) {
  const { getAuthzGrants } = useCosmosService();
  const chains = useChains();
  const { chain = chains[0] } = useAccount();

  return useQuery({
    queryKey: [chain.id, 'grants', granter, grantee],
    enabled: !!granter && !!grantee,
    queryFn: async () => {
      return await getAuthzGrants(granter, grantee);
    },
  });
}

export function useAuthzGranterGrants(granter: string) {
  const { getAuthzGranterGrants } = useCosmosService();
  const chains = useChains();
  const { chain = chains[0] } = useAccount();

  return useQuery({
    queryKey: [chain.id, 'grants-granter', granter],
    enabled: !!granter,
    queryFn: async () => {
      return await getAuthzGranterGrants(granter);
    },
  });
}

export function useAuthzGranteeGrants(grantee: string) {
  const { getAuthzGranteeGrants } = useCosmosService();
  const chains = useChains();
  const { chain = chains[0] } = useAccount();

  return useQuery({
    queryKey: [chain.id, 'grants-grantee', grantee],
    enabled: !!grantee,
    queryFn: async () => {
      return await getAuthzGranteeGrants(grantee);
    },
  });
}
