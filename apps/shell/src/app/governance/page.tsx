import { ProposalStatus } from '@evmos/provider';
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { createCosmosService, getChainParams } from '@haqq/data-access-cosmos';
import { ProposalListPage } from '@haqq/shell-governance';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function ProposalList() {
  // FIXME: Think how to get chain id on server side
  const chainId = 11235;
  const { cosmosRestEndpoint } = getChainParams(chainId);
  const { getProposals, getGovernanceParams, getProposalTally } =
    createCosmosService(cosmosRestEndpoint);
  const proposals = await getProposals();
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [chainId, 'proposals'],
    queryFn: getProposals,
  });

  const ongoingProposals = proposals
    .filter((proposal) => {
      return proposal.status === ProposalStatus.Voting;
    })
    .map((proposal) => {
      return proposal.proposal_id;
    });

  for (const proposalId of ongoingProposals) {
    await queryClient.prefetchQuery({
      queryKey: [chainId, 'proposal-tally', proposalId],
      queryFn: async () => {
        if (!proposalId) {
          return null;
        }

        return await getProposalTally(proposalId);
      },
    });
  }

  await queryClient.prefetchQuery({
    queryKey: [chainId, 'governance-params'],
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

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <ProposalListPage />
    </HydrationBoundary>
  );
}
