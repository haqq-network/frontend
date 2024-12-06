import { useQuery } from '@tanstack/react-query';
import { nanoid } from 'nanoid';
import { formatUnits } from 'viem';
import { useAccount, useChains } from 'wagmi';

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

type IndexerBalance = Array<[string, number, string]>;
type IndexerDate = Array<[string, number, number]>;

interface TokenRate {
  amount: string;
  denom: string;
}

interface IndexerV2UpdatesResponse {
  addresses: unknown[]; // Unused
  available: IndexerBalance;
  available_for_stake: IndexerBalance;
  balance: IndexerBalance;
  chain_id: number;
  dao_locked: IndexerBalance;
  last_update: string;
  locked: IndexerBalance;
  nfts: unknown[];
  rates: Record<string, Record<string, TokenRate[]>>;
  rewards: IndexerBalance;
  staked: IndexerBalance;
  staked_free: IndexerBalance;
  staked_locked: IndexerBalance;
  staked_vested: IndexerBalance;
  tokens: unknown[]; // Unused
  total: IndexerBalance;
  total_locked: IndexerBalance;
  total_staked: IndexerBalance;
  unbounding: IndexerBalance;
  unlock: IndexerDate;
  vested: IndexerBalance;
}

// Create a request to the indexer
function createRequest(
  addresses: Record<number, string[]>,
  date: Date,
  currency = 'USD',
) {
  return {
    jsonrpc: '2.0',
    id: nanoid(),
    method: 'updates_v2',
    params: [addresses, date.toISOString(), currency],
  };
}

// Parse the balance from the indexer response
function safeParseBalance(
  balances: IndexerBalance,
  address: string,
  chainId: number,
): number {
  const balance = balances.find(([addr, chain]) => {
    return addr === address && chain === chainId;
  });

  if (!balance) {
    return 0;
  }

  return Number.parseFloat(formatUnits(BigInt(balance[2]), 18));
}

// Map the balances from the indexer response to the IndexerBalances type
function mapBalances(
  balancesResponse: IndexerV2UpdatesResponse,
  address: string,
  chainId: number,
): IndexerBalances {
  return {
    available: safeParseBalance(balancesResponse.available, address, chainId),
    availableForStake: safeParseBalance(
      balancesResponse.available_for_stake,
      address,
      chainId,
    ),
    balance: safeParseBalance(balancesResponse.balance, address, chainId),
    locked: safeParseBalance(balancesResponse.locked, address, chainId),
    staked: safeParseBalance(balancesResponse.staked, address, chainId),
    stakedFree: safeParseBalance(
      balancesResponse.staked_free,
      address,
      chainId,
    ),
    stakedLocked: safeParseBalance(
      balancesResponse.staked_locked,
      address,
      chainId,
    ),
    total: safeParseBalance(balancesResponse.total, address, chainId),
    vested: safeParseBalance(balancesResponse.vested, address, chainId),
    daoLocked: safeParseBalance(balancesResponse.dao_locked, address, chainId),
    unbonding: safeParseBalance(balancesResponse.unbounding, address, chainId),
    rewards: safeParseBalance(balancesResponse.rewards, address, chainId),
  };
}

// Fetch the balances from the indexer
export async function indexerBalancesFetcher(
  chainId: number,
  address?: string,
) {
  if (!address) {
    return null;
  }

  const addresses = { [chainId]: [address] };

  const requestUrl = new URL(
    'https://backend.wallet.production.haqq.network/api/all_networks/jsonrpc',
  );

  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  const requestBody = createRequest(addresses, new Date());

  try {
    const response = await fetch(requestUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });

    const responseJson = await response.json();

    // Map balances for the given chain
    return mapBalances(responseJson.result, address, chainId);
  } catch (error) {
    console.error((error as Error).message);
    return null;
  }
}

export function useIndexerBalanceQuery(address?: string) {
  const chains = useChains();
  const { chain = chains[0] } = useAccount();

  return useQuery({
    queryKey: ['indexer-balance', address, chain.id],
    enabled: !!address,
    queryFn: async () => {
      return await indexerBalancesFetcher(chain.id, address);
    },
  });
}
