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

export interface IndexerBalancesResponse {
  /** List of addresses in response */
  addresses: string[];
  /** Balance available for spending */
  available: Record<string, string>;
  /** Total balance minus amount available for staking */
  available_for_stake: Record<string, string>;
  /** Current balance of the address */
  balance: Record<string, string>;
  /** Timestamp of last update */
  last_update: string;
  /** All locked tokens (schedule + staking) */
  locked: Record<string, string>;
  /** List of NFTs owned by address */
  nfts: string[];
  /** Token exchange rates */
  rates: {
    axlUSDC: Array<{
      amount: string;
      denom: string;
    }>;
  };
  /** Total amount staked by user */
  staked: Record<string, string>;
  /** Amount of freely staked coins */
  staked_free: Record<string, string>;
  /** Amount locked in staking */
  staked_locked: Record<string, string>;
  /** Amount of vested tokens in staking */
  staked_vested: Record<string, string>;
  /** List of tokens owned by address */
  tokens: string[];
  /** Total balance including staking and available for staking */
  total: Record<string, string>;
  /** Total amount of locked tokens */
  total_locked: Record<string, string>;
  /** Total amount involved in staking */
  total_staked: Record<string, string>;
  /** List of transactions */
  transactions: string[];
  /** Tokens in unbonding period */
  unbounding: Record<string, string>;
  /** Unlock schedule timestamps */
  unlock: Record<string, number>;
  /** Locked tokens on balance */
  vested: Record<string, string>;
  /** Sum of all user tokens aISLM and aLIQUIDXXXX 1:1 */
  dao_locked: Record<string, string>;
  /** Uncollected staking rewards */
  rewards: Record<string, string>;
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
  unbonding: number;
  rewards: number;
}

const INDEXER_ENDPOINT = 'https://jsonrpc.indexer.haqq.network';
const TESTEDGE_INDEXER_ENDPOINT =
  'https://jsonrpc.indexer.testedge2.haqq.network';

// Helper function to safely parse numbers
function safeParse(field: Record<string, string>, address: string) {
  return address in field
    ? Number.parseFloat(formatUnits(BigInt(field[address]), 18))
    : 0;
}

function mapBalances(
  balancesResponse: IndexerBalancesResponse,
  address: string,
): IndexerBalances {
  return {
    available: safeParse(balancesResponse.available, address),
    availableForStake: safeParse(balancesResponse.available_for_stake, address),
    balance: safeParse(balancesResponse.balance, address),
    locked: safeParse(balancesResponse.locked, address),
    staked: safeParse(balancesResponse.staked, address),
    stakedFree: safeParse(balancesResponse.staked_free, address),
    stakedLocked: safeParse(balancesResponse.staked_locked, address),
    total: safeParse(balancesResponse.total, address),
    vested: safeParse(balancesResponse.vested, address),
    daoLocked: safeParse(balancesResponse.dao_locked, address),
    unbonding: safeParse(balancesResponse.unbounding, address),
    rewards: safeParse(balancesResponse.rewards, address),
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
