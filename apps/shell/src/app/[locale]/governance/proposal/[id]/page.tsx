import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { createCosmosService, getChainParams } from '@haqq/data-access-cosmos';
import { ProposalDetailsPage } from '@haqq/shell-governance';
import { parseWagmiCookies } from '@haqq/shell-shared';
import { supportedChainsIds } from '../../../../../config/wagmi-config';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function ProposalDetails({
  params,
}: {
  params: { id: string };
}) {
  const proposalId = params.id;

  if (!proposalId) {
    notFound();
  }

  const cookies = headers().get('cookie');
  const { chainId } = parseWagmiCookies(cookies);
  const chainIdToUse =
    chainId && supportedChainsIds.includes(chainId)
      ? chainId
      : supportedChainsIds[0];
  const { cosmosRestEndpoint } = getChainParams(chainIdToUse);
  const {
    getProposalDetails,
    getGovernanceParams,
    getStakingPool,
    getProposalTally,
  } = createCosmosService(cosmosRestEndpoint);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [chainIdToUse, 'proposal', proposalId],
    queryFn: async () => {
      if (!proposalId) {
        return null;
      }

      return await getProposalDetails(proposalId);
    },
  });

  await queryClient.prefetchQuery({
    queryKey: [chainIdToUse, 'proposal-tally', proposalId],
    queryFn: async () => {
      if (!proposalId) {
        return null;
      }

      return await getProposalTally(proposalId);
    },
  });

  await queryClient.prefetchQuery({
    queryKey: [chainIdToUse, 'staking-pool'],
    queryFn: getStakingPool,
  });

  await queryClient.prefetchQuery({
    queryKey: [chainIdToUse, 'governance-params'],
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
