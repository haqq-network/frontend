import { generateEndpointProposals } from '@evmos/provider';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import { GetGovernanceParamsResponse, Proposal } from '@haqq/shell-shared';
import { MainPage } from '@haqq/shell-main';

async function getShellChainStatsData(options: Partial<any>) {
  const requestUrl = new URL('/shell/chain_stats', 'https://falconer.haqq.sh');
  const response = await fetch(requestUrl, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error('Chain stats fetch failed');
  }

  const { stats }: { stats: any } = await response.json();

  return stats;
}

const cosmosRestEndpoint = 'https://rest.cosmos.haqq.network';

async function getProposals() {
  const proposalsUrl = new URL(
    `${cosmosRestEndpoint}${generateEndpointProposals()}`,
  );

  proposalsUrl.searchParams.append('pagination.reverse', 'true');

  const response = await axios.get<{ proposals: Proposal[] }>(
    proposalsUrl.toString(),
  );

  return response.data.proposals;
}

function generateEndpointGovParams(type: any) {
  return `/cosmos/gov/v1beta1/params/${type}`;
}

async function getGovernanceParams(type: string) {
  const governanceParamsResponse = await axios.get<GetGovernanceParamsResponse>(
    `${cosmosRestEndpoint}${generateEndpointGovParams(type as any)}`,
  );

  return governanceParamsResponse.data;
}

export default async function IndexPage() {
  const chainId = 11235;
  const queryClient = new QueryClient();
  // FIXME: Think how to get chain id on server side

  await queryClient.prefetchQuery({
    queryKey: [chainId, 'chain-stats'],
    queryFn: getShellChainStatsData,
  });
  await queryClient.prefetchQuery({
    queryKey: [chainId, 'proposals'],
    queryFn: getProposals,
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
      <MainPage />
    </HydrationBoundary>
  );
}
