import { UseQueryResult, useQueries, useQuery } from '@tanstack/react-query';
import { useNetwork } from 'wagmi';
import { useCosmosService } from '../../providers/cosmos-provider';
import { useSupportedChains } from '../../providers/wagmi-provider';

export function useProposalListQuery() {
  const { getProposals } = useCosmosService();
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();

  return useQuery({
    queryKey: [chain.id, 'proposals'],
    queryFn: getProposals,
  });
}

export function useProposalDetailsQuery(proposalId: string | undefined) {
  const { getProposalDetails } = useCosmosService();
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();

  return useQuery({
    queryKey: [chain.id, 'proposal', proposalId],
    enabled: !!proposalId,
    queryFn: async () => {
      if (!proposalId) {
        return null;
      }

      return await getProposalDetails(proposalId);
    },
  });
}

export function useGovernanceParamsQuery() {
  const { getGovernanceParams } = useCosmosService();
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();

  return useQuery({
    queryKey: [chain.id, 'governance-params'],
    queryFn: async () => {
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
  });
}

export function useProposalTallyQuery(proposalId: string | undefined) {
  const { getProposalTally } = useCosmosService();
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();

  return useQuery({
    queryKey: [chain.id, 'proposal-tally', proposalId],
    enabled: !!proposalId,
    queryFn: async () => {
      if (!proposalId) {
        return null;
      }

      return await getProposalTally(proposalId);
    },
  });
}

export function useProposalTallysQuery(proposalIds: string[] = []) {
  const { getProposalTally } = useCosmosService();
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();

  return useQueries({
    queries: proposalIds.map((proposalId) => {
      return {
        queryKey: [chain.id, 'proposal-tally', proposalId],
        enabled: !!proposalId,
        queryFn: async () => {
          return await getProposalTally(proposalId);
        },
      };
    }),
  });
}

export function useProposalVoteQuery(
  proposalId: string,
  voterAddress: string | undefined,
): UseQueryResult<string | null, Error> {
  const { getProposalVotes } = useCosmosService();
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();

  return useQuery({
    queryKey: [chain.id, 'proposal-votes', proposalId, voterAddress],
    enabled: !!proposalId && !!voterAddress,
    queryFn: async () => {
      if (!voterAddress) {
        return null;
      }

      try {
        return await getProposalVotes(proposalId, voterAddress);
      } catch (error) {
        console.error(error);
        return null;
      }
    },
  });
}

export function useProposalVotesQuery(
  proposalIds: string[],
  voterAddress: string | undefined,
) {
  const { getProposalVotes } = useCosmosService();
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();

  return useQueries({
    queries: proposalIds.map((proposalId) => {
      return {
        queryKey: [chain.id, 'proposal-votes', proposalId, voterAddress],
        enabled: !!proposalId && !!voterAddress,
        queryFn: async () => {
          if (!voterAddress) {
            return null;
          }

          return await getProposalVotes(proposalId, voterAddress);
        },
      };
    }),
  });
}

// export function useProposalVotesQuery(voterAddress: string | undefined) {
//   const { getVotes } = useCosmosService();
//   const chains = useSupportedChains();
//   const { chain = chains[0] } = useNetwork();

//   return useQuery({
//     queryKey: [chain.id, 'votes', voterAddress],
//     queryFn: async () => {
//       if (!voterAddress) {
//         return null;
//       }

//       try {
//         return await getVotes(voterAddress);
//       } catch (error) {
//         console.error(error);
//         return null;
//       }
//     },
//   });
// }
