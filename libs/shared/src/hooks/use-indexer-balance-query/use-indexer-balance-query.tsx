import { useQuery } from '@tanstack/react-query';
import { nanoid } from 'nanoid';
import { formatUnits } from 'viem';
import { useAccount, useChains } from 'wagmi';
import { haqqTestedge2 } from 'wagmi/chains';

function createRequest(address: string, date: Date) {
  return {
    jsonrpc: '2.0',
    id: nanoid(),
    method: 'updates',
    params: [[address], date.toISOString()],
  };
}

function parseResponseNumber(number: string) {
  return Number.parseFloat(formatUnits(BigInt(number), 18));
}

export interface IndexerBalancesResponse {
  addresses: string[];
  available: Record<string, string>;
  available_for_stake: Record<string, string>;
  balance: Record<string, string>;
  last_update: string;
  locked: Record<string, string>;
  nfts: string[];
  staked: Record<string, string>;
  staked_free: Record<string, string>;
  staked_locked: Record<string, string>;
  tokens: string[];
  total: Record<string, string>;
  transactions: string[];
  unlock: Record<string, number>;
  vested: Record<string, string>;
}

export interface IndexerBalances {
  available: number;
  availableForStake: number;
  balance: number;
  locked: number;
  staked: number;
  stakedFree: number;
  stakedLocked: number;
  total: number;
  // unlock: number;
  vested: number;
}

const INDEXER_ENDPOINT = 'https://jsonrpc.indexer.haqq.network';
const TESTEDGE_INDEXER_ENDPOINT =
  'https://jsonrpc.indexer.testedge2.haqq.network';

function mapBalances(
  balancesResponse: IndexerBalancesResponse,
  address: string,
): IndexerBalances {
  return {
    available: parseResponseNumber(balancesResponse.available[address]),
    availableForStake: parseResponseNumber(
      balancesResponse.available_for_stake[address],
    ),
    balance: parseResponseNumber(balancesResponse.balance[address]),
    locked: parseResponseNumber(balancesResponse.locked[address]),
    staked: parseResponseNumber(balancesResponse.staked[address]),
    stakedFree: parseResponseNumber(balancesResponse.staked_free[address]),
    stakedLocked: parseResponseNumber(balancesResponse.staked_locked[address]),
    total: parseResponseNumber(balancesResponse.total[address]),
    // unlock: parseResponseNumber(balancesResponse.unlock[address]),
    vested: parseResponseNumber(balancesResponse.vested[address]),
  };
}

export async function indexerBalancesFetcher(
  chainId: number,
  address?: string,
) {
  if (!address) {
    return null;
  }
  const isTestedge = chainId === haqqTestedge2.id;
  const requestUrl = new URL(
    isTestedge ? TESTEDGE_INDEXER_ENDPOINT : INDEXER_ENDPOINT,
  );

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  const nowDate = new Date(Date.now());
  const requestBody = createRequest(address, nowDate);

  try {
    const response = await fetch(requestUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
      redirect: 'follow',
    });

    const responseJson = await response.json();
    return mapBalances(responseJson.result, address);
  } catch (error) {
    console.error((error as Error).message);
    return null;
  }
}

export function useIndexerBalanceQuery(address?: string) {
  const chains = useChains();
  const { chain = chains[0] } = useAccount();

  return useQuery({
    queryKey: [chain.id, 'indexer-balance', address],
    enabled: !!address,
    queryFn: async () => {
      return await indexerBalancesFetcher(chain.id, address);
    },
  });
}
