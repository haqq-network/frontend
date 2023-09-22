import { useQuery } from '@tanstack/react-query';
import { useCosmosService } from '../../providers/cosmos-provider';
import { useNetwork } from 'wagmi';

export function useProposalListQuery() {
  const { getProposals } = useCosmosService();
  const { chain } = useNetwork();

  return useQuery([chain?.id, 'proposals'], getProposals, {
    refetchOnWindowFocus: false,
  });
}

export function useProposalDetailsQuery(proposalId: string | undefined) {
  const { getProposalDetails } = useCosmosService();
  const { chain } = useNetwork();

  return useQuery(
    [chain?.id, 'proposal', proposalId],
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
  const { chain } = useNetwork();

  return useQuery(
    [chain?.id, 'governance-params'],
    async () => {
      const [deposit_params, voting_params, tally_params] = await Promise.all([
        getGovernanceParams('deposit').then((res) => {
          return res.deposit_params;
        }),
        getGovernanceParams('voting').then((res) => {
          return res.voting_params;
        }),
        getGovernanceParams('tallying').then((res) => {
          return res.tally_params;
        }),
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

export function useProposalTally(proposalId: string | undefined) {
  const { getProposalTally } = useCosmosService();
  const { chain } = useNetwork();

  return useQuery(
    [chain?.id, 'proposal-tally', proposalId],
    async () => {
      if (!proposalId) {
        return null;
      }

      return await getProposalTally(proposalId);
    },
    {
      refetchOnWindowFocus: true,
      refetchInterval: 5000,
    },
  );
}
