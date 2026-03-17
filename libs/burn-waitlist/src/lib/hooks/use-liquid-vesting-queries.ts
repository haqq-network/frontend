'use client';

import { useQuery } from '@tanstack/react-query';
import { getCosmosRestUrl } from '../constants/waitlist-config';

export interface LiquidDenomSchedule {
  cliff_date: string;
  start_date: string;
  end_date: string;
  amount: string;
}

export interface LiquidDenomInfo {
  denom: string;
  display_denom: string;
  original_denom: string;
  liquidity_provider: string;
  end: string;
  lockup_periods: LiquidDenomSchedule[];
  vesting_periods: LiquidDenomSchedule[];
}

export interface LiquidDenomResponse {
  denom: LiquidDenomInfo;
}

export interface BankBalance {
  denom: string;
  amount: string;
}

export interface BankBalancesResponse {
  balances: BankBalance[];
  pagination: {
    next_key: string | null;
    total: string;
  };
}

interface MinimumLiquidationAmountResponse {
  param: {
    subspace: string;
    key: string;
    value: string;
  };
}

/**
 * Hook to fetch the minimum liquidation amount from the liquidvesting module params
 */
export function useMinimumLiquidationAmount({
  chainId,
}: { chainId?: number } = {}) {
  return useQuery<bigint>({
    queryKey: ['minimum-liquidation-amount', chainId],
    queryFn: async () => {
      const baseUrl = getCosmosRestUrl(chainId);
      const url = `${baseUrl}/cosmos/params/v1beta1/params?subspace=liquidvesting&key=MinimumLiquidationAmount`;

      const response = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch minimum liquidation amount: ${response.status} ${errorText}`,
        );
      }

      const data: MinimumLiquidationAmountResponse = await response.json();
      // value comes as a quoted string e.g. "\"1000000000000000000000\""
      const raw = data.param.value.replace(/"/g, '');
      return BigInt(raw);
    },
    staleTime: 60000,
  });
}

interface LockupPeriod {
  length: string;
  amount: { denom: string; amount: string }[];
}

interface ClawbackVestingAccount {
  '@type': string;
  base_vesting_account: {
    base_account: {
      address: string;
    };
    original_vesting: { denom: string; amount: string }[];
    delegated_free: { denom: string; amount: string }[];
    delegated_vesting: { denom: string; amount: string }[];
    end_time: string;
  };
  start_time: string;
  lockup_periods: LockupPeriod[];
  vesting_periods: LockupPeriod[];
}

interface AccountResponse {
  account: ClawbackVestingAccount | { '@type': string };
}

function computeLockedVesting(account: ClawbackVestingAccount): bigint {
  const originalVesting = account.base_vesting_account.original_vesting.reduce(
    (sum, coin) => {
      return coin.denom === 'aISLM' ? sum + BigInt(coin.amount) : sum;
    },
    0n,
  );

  const startTime = account.start_time.includes('T')
    ? Math.floor(new Date(account.start_time).getTime() / 1000)
    : Number(account.start_time);

  const now = Math.floor(Date.now() / 1000);
  let cumulativeTime = startTime;
  let unlocked = 0n;

  for (const period of account.lockup_periods) {
    cumulativeTime += Number(period.length);
    if (now >= cumulativeTime) {
      for (const coin of period.amount) {
        if (coin.denom === 'aISLM') {
          unlocked += BigInt(coin.amount);
        }
      }
    } else {
      break;
    }
  }

  const locked = originalVesting - unlocked;
  return locked > 0n ? locked : 0n;
}

/**
 * Hook to fetch vesting locked balance from the cosmos auth account endpoint
 */
export function useVestingBalance({
  haqqAddress,
  chainId,
}: { haqqAddress?: string; chainId?: number } = {}) {
  return useQuery<bigint>({
    queryKey: ['vesting-balance', haqqAddress, chainId],
    queryFn: async () => {
      const baseUrl = getCosmosRestUrl(chainId);
      const url = `${baseUrl}/cosmos/auth/v1beta1/accounts/${haqqAddress}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch account info: ${response.status} ${errorText}`,
        );
      }

      const data: AccountResponse = await response.json();

      if (!data.account['@type']?.includes('VestingAccount')) {
        return 0n;
      }

      return computeLockedVesting(data.account as ClawbackVestingAccount);
    },
    enabled: !!haqqAddress,
    staleTime: 15000,
  });
}

interface UseLiquidDenomInfoParams {
  denom?: string;
  chainId?: number;
}

/**
 * Hook to fetch liquid denom info from the liquidvesting REST endpoint
 */
export function useLiquidDenomInfo({
  denom,
  chainId,
}: UseLiquidDenomInfoParams = {}) {
  return useQuery<LiquidDenomResponse>({
    queryKey: ['liquid-denom-info', denom, chainId],
    queryFn: async () => {
      const baseUrl = getCosmosRestUrl(chainId);
      const url = `${baseUrl}/haqq/liquidvesting/v1/denom?denom=${encodeURIComponent(denom!)}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch liquid denom info: ${response.status} ${errorText}`,
        );
      }

      return response.json();
    },
    enabled: !!denom,
    staleTime: 30000,
  });
}

interface UseLiquidTokenBalancesParams {
  haqqAddress?: string;
  chainId?: number;
}

/**
 * Hook to fetch all liquid tokens (aLIQUID*) at the connected address
 * Fetches bank balances and filters for liquid vesting denoms
 */
export function useLiquidTokenBalances({
  haqqAddress,
  chainId,
}: UseLiquidTokenBalancesParams = {}) {
  return useQuery<BankBalance[]>({
    queryKey: ['liquid-token-balances', haqqAddress, chainId],
    queryFn: async () => {
      const baseUrl = getCosmosRestUrl(chainId);
      const url = `${baseUrl}/cosmos/bank/v1beta1/balances/${haqqAddress}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch bank balances: ${response.status} ${errorText}`,
        );
      }

      const data: BankBalancesResponse = await response.json();

      // Filter for liquid vesting tokens (denoms starting with "aLIQUID")
      return data.balances.filter((balance) => {
        return balance.denom.startsWith('aLIQUID');
      });
    },
    enabled: !!haqqAddress,
    staleTime: 10000,
  });
}
