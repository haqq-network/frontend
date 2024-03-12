import { useCallback } from 'react';
import { nanoid } from 'nanoid';
import { Hex, formatUnits } from 'viem';

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
  available: Record<Hex, string>;
  available_for_stake: Record<Hex, string>;
  balance: Record<Hex, string>;
  last_update: string;
  locked: Record<Hex, string>;
  nfts: string[];
  staked: Record<Hex, string>;
  staked_free: Record<Hex, string>;
  staked_locked: Record<Hex, string>;
  tokens: string[];
  total: Record<Hex, string>;
  transactions: string[];
  unlock: Record<Hex, number>;
  vested: Record<Hex, string>;
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

function mapBalances(
  balancesResponse: IndexerBalancesResponse,
  address: Hex,
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
  const getBalances = useCallback(async (address: Hex) => {
    const requestUrl = new URL(INDEXER_ENDPOINT);

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
      console.log({ response });
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
