'use client';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { haqqTestedge2 } from 'viem/chains';
import { useAccount, useChains } from 'wagmi';

export interface AddressUnbonding {
  address: string;
  receiver: string;
  unbonding_estimated_time: string;
  amount: string;
  denom: string;
  claim_is_pending: boolean;
  epoch_number: string;
}

export interface UnbondingsResponse {
  address_unbondings: AddressUnbonding[];
}

export interface StrideUnbonding {
  isPending: boolean;
  amount: bigint;
  denom: string;
  estimatedTime: string;
  receiver: string;
}

async function getLiquidStakingUnbondings(
  address: string,
): Promise<StrideUnbonding[]> {
  try {
    const response = await fetch(`/api/liquid-staking/unbondings/${address}`);

    if (!response.ok) {
      throw new Error('Failed to fetch unbondings');
    }

    const data = (await response.json()) as UnbondingsResponse;
    return data.address_unbondings
      .filter((unbonding) => {
        return !unbonding.claim_is_pending;
      })
      .map((unbonding) => {
        return {
          isPending: !unbonding.claim_is_pending,
          amount: BigInt(unbonding.amount),
          denom: unbonding.denom,
          estimatedTime: unbonding.unbonding_estimated_time,
          receiver: unbonding.receiver,
        };
      });
  } catch (error) {
    console.error('Error fetching unbondings:', error);
    return [];
  }
}

export function useLiquidStakingUnbondings(address?: string) {
  const chains = useChains();
  const { chain = chains[0] } = useAccount();
  const isTestedge = chain.id === haqqTestedge2.id;

  return useQuery({
    queryKey: [chain.id, 'liquid-staking-unbondings', address],
    enabled: !!address && !isTestedge,
    queryFn: async () => {
      if (!address || isTestedge) {
        return null;
      }

      return await getLiquidStakingUnbondings(address);
    },
  });
}

// Hook to calculate total unbonding amount
export function useStrideUnbondingTotal(unbondings: StrideUnbonding[]) {
  return useMemo(() => {
    return unbondings.reduce((acc, curr) => {
      return acc + curr.amount;
    }, BigInt(0));
  }, [unbondings]);
}

// Hook to get the first and last unbonding dates
export function useStrideUnbondingDates(unbondings: StrideUnbonding[]) {
  return useMemo(() => {
    if (!unbondings.length) return { firstDate: null, lastDate: null };

    return unbondings.reduce(
      (dates, current) => {
        const currentDate = new Date(current.estimatedTime);
        // Update first date if current date is earlier
        if (currentDate < dates.firstDate) {
          dates.firstDate = currentDate;
        }
        // Update last date if current date is later
        if (currentDate > dates.lastDate) {
          dates.lastDate = currentDate;
        }
        return dates;
      },
      {
        firstDate: new Date(unbondings[0].estimatedTime),
        lastDate: new Date(unbondings[0].estimatedTime),
      },
    );
  }, [unbondings]);
}
