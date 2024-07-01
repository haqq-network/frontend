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
  available: Record<string, string>; // Balance available for spending
  available_for_stake: Record<string, string>; // Total balance - amount available for staking
  balance: Record<string, string>; // No change, existing field
  last_update: string;
  locked: Record<string, string>; // All locked tokens (schedule + staking)
  nfts: string[]; // No change, existing field
  staked: Record<string, string>; // All stakes of the user
  staked_free: Record<string, string>; // Freely staked coins
  staked_locked: Record<string, string>; // Locked, in staking
  tokens: string[]; // No change, existing field
  total: Record<string, string>; // Total balance including staking and available for staking
  transactions: string[]; // No change, existing field
  unlock: Record<string, number>; // No change, existing field
  vested: Record<string, string>; // Locked, on balance
  dao_locked: Record<string, string>; // Sum of all user tokens aISLM and aLIQUIDXXXX 1 to 1
  unbonding: Record<string, string>; // Tokens in the unbonding pool
  rewards: Record<string, string>; // Staking rewards not yet collected (currently not working)
  total_staked: Record<string, string>; // All user tokens involved in staking
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
  vested: number;
  daoLocked: number;
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
    vested: parseResponseNumber(balancesResponse.vested[address]),
    daoLocked: parseResponseNumber(balancesResponse.dao_locked[address]),
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
