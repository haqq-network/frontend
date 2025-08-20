import { useQuery } from '@tanstack/react-query';
import { formatUnits } from 'viem';
import { haqqMainnet, haqqTestedge2 } from 'viem/chains';
import { useAccount, useChains } from 'wagmi';

export interface IndexerBalances {
  available: number;
  availableBn: bigint;
  availableForStake: number;
  availableForStakeBn: bigint;
  balance: number;
  balanceBn: bigint;
  locked: number;
  lockedBn: bigint;
  staked: number;
  stakedBn: bigint;
  stakedFree: number;
  stakedFreeBn: bigint;
  stakedLocked: number;
  stakedLockedBn: bigint;
  total: number;
  totalBn: bigint;
  vested: number;
  vestedBn: bigint;
  daoLocked: number;
  daoLockedBn: bigint;
  unbonding: number;
  unbondingBn: bigint;
  rewards: number;
  rewardsBn: bigint;
}

interface FalconerBalanceResponse {
  available_for_stake: string;
  available: string;
  staked: string;
  unbounding: string;
  rewards: string;
  total_locked: string;
  vested: string;
  staked_vested: string;
  staked_free: string;
  total_staked: string;
  dao_locked: string;
  locked: string;
  total: string;
  balance: string;
  unlock: string;
}

// Parse balance hex string to number and bigint
function parseBalance(balanceStr: string): { value: number; valueBn: bigint } {
  if (!balanceStr || balanceStr === '0x0') {
    return { value: 0, valueBn: 0n };
  }

  const valueBn = BigInt(balanceStr);
  const value = Number.parseFloat(formatUnits(valueBn, 18));

  return { value, valueBn };
}

// Map the balances from the Falconer response to the IndexerBalances type
function mapBalances(
  balancesResponse: FalconerBalanceResponse,
): IndexerBalances {
  const available = parseBalance(balancesResponse.available);
  const availableForStake = parseBalance(balancesResponse.available_for_stake);
  const balance = parseBalance(balancesResponse.balance);
  const locked = parseBalance(balancesResponse.locked);
  const staked = parseBalance(balancesResponse.staked);
  const stakedFree = parseBalance(balancesResponse.staked_free);
  const stakedLocked = parseBalance(balancesResponse.staked_vested);
  const total = parseBalance(balancesResponse.total);
  const vested = parseBalance(balancesResponse.vested);
  const daoLocked = parseBalance(balancesResponse.dao_locked);
  const unbonding = parseBalance(balancesResponse.unbounding);
  const rewards = parseBalance(balancesResponse.rewards);

  return {
    available: available.value,
    availableBn: available.valueBn,
    availableForStake: availableForStake.value,
    availableForStakeBn: availableForStake.valueBn,
    balance: balance.value,
    balanceBn: balance.valueBn,
    locked: locked.value,
    lockedBn: locked.valueBn,
    staked: staked.value,
    stakedBn: staked.valueBn,
    stakedFree: stakedFree.value,
    stakedFreeBn: stakedFree.valueBn,
    stakedLocked: stakedLocked.value,
    stakedLockedBn: stakedLocked.valueBn,
    total: total.value,
    totalBn: total.valueBn,
    vested: vested.value,
    vestedBn: vested.valueBn,
    daoLocked: daoLocked.value,
    daoLockedBn: daoLocked.valueBn,
    unbonding: unbonding.value,
    unbondingBn: unbonding.valueBn,
    rewards: rewards.value,
    rewardsBn: rewards.valueBn,
  };
}

// Fetch the balances from the Falconer API
export async function indexerBalancesFetcher(
  chainId: number,
  address?: string,
) {
  if (!address) {
    return null;
  }

  // Build the URL based on chain ID
  const baseUrl = `https://falconer.haqq.network/balances/${address}`;
  const requestUrl = new URL(baseUrl);

  // Add network parameter for testnet (54211) and mainnet (11235)
  if (chainId === haqqMainnet.id || chainId === haqqTestedge2.id) {
    requestUrl.searchParams.set('network', chainId.toString());
  }

  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  try {
    const response = await fetch(requestUrl, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseJson: FalconerBalanceResponse = await response.json();

    // Map balances from Falconer response
    return mapBalances(responseJson);
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
