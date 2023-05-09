import { useQuery } from '@tanstack/react-query';
import { useCosmosService } from '../../providers/cosmos-provider';

export function useProposalListQuery() {
  const { getProposals } = useCosmosService();

  return useQuery(['proposals'], getProposals, {
    refetchOnWindowFocus: false,
  });
}

export function useProposalDetailsQuery(proposalId: string | undefined) {
  const { getProposalDetails } = useCosmosService();

  return useQuery(
    ['proposal', proposalId],
    async () => {
      if (!proposalId) {
        return null;
      }

      return await getProposalDetails(proposalId);
    },
    {
      refetchOnWindowFocus: false,
    },
  );
}
