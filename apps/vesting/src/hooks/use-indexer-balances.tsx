import { useCallback } from 'react';
import { nanoid } from 'nanoid';
import { formatUnits } from 'viem';
import { environment } from '../environments/environment';

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

export function useIndexerBalances() {
  const getBalances = useCallback(async (address: string) => {
    if (!environment.indexerEndpoint || environment.indexerEndpoint === '') {
      console.warn('no indexer endpoint');
      return undefined;
    }

    const requestUrl = new URL(environment.indexerEndpoint);

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
      return undefined;
    }
  }, []);

  return {
    getBalances,
  };
}
