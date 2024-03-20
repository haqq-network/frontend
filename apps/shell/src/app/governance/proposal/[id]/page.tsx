import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { createCosmosService, getChainParams } from '@haqq/data-access-cosmos';
import { ProposalDetailsPage } from '@haqq/shell-governance';

export default async function ProposalDetails({
  params,
}: {
  params: { id: string };
}) {
  const proposalId = params.id;

  if (!proposalId) {
    notFound();
  }

  // FIXME: Think how to get chain id on server side
  const chainId = 11235;
  const { cosmosRestEndpoint } = getChainParams(chainId);
  const {
    getProposalDetails,
    getGovernanceParams,
    getStakingPool,
    getProposalTally,
  } = createCosmosService(cosmosRestEndpoint);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [chainId, 'proposal', proposalId],
    queryFn: async () => {
      if (!proposalId) {
        return null;
      }

      return await getProposalDetails(proposalId);
    },
  });

  await queryClient.prefetchQuery({
    queryKey: [chainId, 'proposal-tally', proposalId],
    queryFn: async () => {
      if (!proposalId) {
        return null;
      }

      return await getProposalTally(proposalId);
    },
  });

  await queryClient.prefetchQuery({
    queryKey: [chainId, 'staking-pool'],
    queryFn: getStakingPool,
  });

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
      <ProposalDetailsPage proposalId={proposalId} />
    </HydrationBoundary>
  );
}
