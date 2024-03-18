import { generateEndpointProposals } from '@evmos/provider';
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { ProposalListPage } from '@haqq/shell-governance';

const cosmosRestEndpoint = 'https://rest.cosmos.haqq.network';

async function getProposals() {
  const proposalsUrl = new URL(
    `${cosmosRestEndpoint}${generateEndpointProposals()}`,
  );

  proposalsUrl.searchParams.append('pagination.reverse', 'true');

  const response = await fetch(proposalsUrl.toString());

  const responseJson = await response.json();

  return responseJson.proposals;
}

export default async function ProposalList() {
  const chainId = 11235;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [chainId, 'proposals'],
    queryFn: getProposals,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <ProposalListPage />
    </HydrationBoundary>
  );
}
