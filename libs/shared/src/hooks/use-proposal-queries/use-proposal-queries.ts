import { useQuery } from '@tanstack/react-query';
import { useCosmosService } from '../../providers/cosmos-provider';
import { GovParamsType } from '@cosmjs/stargate';

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

export function useGovernanceParamsQuery() {
  const { getGovernanceParams } = useCosmosService();

  return useQuery(
    ['governance-params'],
    async () => {
      const [deposit_params, voting_params, tally_params] = await Promise.all([
        getGovernanceParams('deposit').then((res) => res.deposit_params),
        getGovernanceParams('voting').then((res) => res.voting_params),
        getGovernanceParams('tallying').then((res) => res.tally_params),
      ]);

      return {
        deposit_params,
        voting_params,
        tally_params,
      };
    },
    {
      refetchOnWindowFocus: false,
    },
  );
}
