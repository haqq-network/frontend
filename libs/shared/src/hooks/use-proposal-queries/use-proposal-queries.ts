import { useQueries, useQuery } from '@tanstack/react-query';
import { useCosmosService } from '../../providers/cosmos-provider';
import { useNetwork } from 'wagmi';
import { useSupportedChains } from '../../providers/wagmi-provider';

export function useProposalListQuery() {
  const { getProposals } = useCosmosService();
  const { chain } = useNetwork();
  const chains = useSupportedChains();
  const chainId = chain?.id ?? chains[0].id;

  return useQuery([chainId, 'proposals'], getProposals, {
    refetchOnWindowFocus: false,
  });
}

export function useProposalDetailsQuery(proposalId: string | undefined) {
  const { getProposalDetails } = useCosmosService();
  const { chain } = useNetwork();
  const chains = useSupportedChains();
  const chainId = chain?.id ?? chains[0].id;

  return useQuery(
    [chainId, 'proposal', proposalId],
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
  const chains = useSupportedChains();
  const chainId = chain?.id ?? chains[0].id;

  return useQuery(
    [chainId, 'governance-params'],
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
  const chains = useSupportedChains();
  const chainId = chain?.id ?? chains[0].id;

  return useQuery(
    [chainId, 'proposal-tally', proposalId],
    async () => {
      if (!proposalId) {
        return null;
      }

      return await getProposalTally(proposalId);
    },
    {
      refetchOnWindowFocus: false,
    },
  );
}

export function useProposalTallys(proposalIds: string[] = []) {
  const { getProposalTally } = useCosmosService();
  const { chain } = useNetwork();
  const chains = useSupportedChains();
  const chainId = chain?.id ?? chains[0].id;

  return useQueries({
    queries: proposalIds.map((id) => {
      return {
        queryKey: [chainId, 'proposal-tally', id],
        queryFn: async () => {
          return await getProposalTally(id);
        },
        refetchOnWindowFocus: false,
      };
    }),
  });
}
