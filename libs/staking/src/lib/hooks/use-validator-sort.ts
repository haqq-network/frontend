'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  DistributionRewardsResponse,
  GetDelegationsResponse,
  Validator,
} from '@evmos/provider';
import store from 'store2';
import { useAddress } from '@haqq/shell-shared';
import {
  createSortValidatorsByStakedOrReward,
  createSortValidatorsByVotingPowerPercent,
  randomSortWithSeed,
  sortValidatorsByFee,
  sortValidatorsByName,
  sortValidatorsByStatus,
  sortValidatorsByVotingPower,
} from '../utils/sort-validators';

export type SortDirection = 'asc' | 'desc';

export type SortState =
  | {
      key: string;
      direction: SortDirection;
    }
  | {
      key: 'random';
      direction: null;
    };

export function useSortedValidators(
  validators: Validator[],
  sortState: SortState,
  totalStaked: number,
  rewardsInfo: DistributionRewardsResponse | null | undefined,
  delegationInfo: GetDelegationsResponse | null | undefined,
  seed: string,
) {
  const getDelegationsInfo = useCallback(
    (addresses: string[]): Array<number> => {
      return addresses.map((address) => {
        const delegationAmount = delegationInfo?.delegation_responses?.find(
          (delegation) => {
            return delegation.delegation.validator_address === address;
          },
        );

        return Number.parseFloat(delegationAmount?.balance.amount ?? '0');
      });
    },
    [delegationInfo],
  );

  const getRewardsInfo = useCallback(
    (addresses: string[]): Array<number> => {
      return addresses.map((address) => {
        const rewards = rewardsInfo?.rewards?.find((rewardsItem) => {
          return rewardsItem.validator_address === address;
        });

        return Number.parseFloat(rewards?.reward[0].amount ?? '0');
      });
    },
    [rewardsInfo],
  );

  const sortValidators = useCallback(
    (validators: Validator[], state: SortState) => {
      const sortedValidators = [...validators];

      if (state.key === 'random') {
        return randomSortWithSeed(validators, seed);
      }

      // Sorting logic based on the provided sortState
      switch (state.key) {
        case 'name':
          sortedValidators.sort(sortValidatorsByName);
          break;

        case 'status':
          sortedValidators.sort(sortValidatorsByStatus);
          break;

        case 'fee':
          sortedValidators.sort((a, b) => {
            const result = sortValidatorsByFee(a, b);
            return state.direction === 'asc' ? -result : result;
          });
          break;

        case 'votingPower':
          sortedValidators.sort((a, b) => {
            const result = sortValidatorsByVotingPower(a, b);
            return state.direction === 'asc' ? -result : result;
          });
          break;

        case 'votingPowerPercent':
          sortedValidators.sort((a, b) => {
            const result = createSortValidatorsByVotingPowerPercent(
              totalStaked,
            )(a, b);
            return state.direction === 'asc' ? -result : result;
          });
          break;

        case 'staked':
          sortedValidators.sort((a, b) => {
            const result = createSortValidatorsByStakedOrReward(
              getDelegationsInfo,
            )(a, b);
            return state.direction === 'asc' ? -result : result;
          });
          break;

        case 'reward':
          sortedValidators.sort((a, b) => {
            const result = createSortValidatorsByStakedOrReward(getRewardsInfo)(
              a,
              b,
            );
            return state.direction === 'asc' ? -result : result;
          });
          break;

        default:
          break;
      }

      return sortedValidators;
    },
    [getDelegationsInfo, getRewardsInfo, seed, totalStaked],
  );

  return useMemo(() => {
    return sortValidators(validators, sortState);
  }, [sortValidators, validators, sortState]);
}

export function useValidatorsSortState() {
  const { ethAddress } = useAddress();
  const storeKey = `validators_sort_state_${ethAddress}`;
  const storedSortState: string | null = store.session.get(storeKey);
  const defaultSortState: SortState = storedSortState
    ? JSON.parse(storedSortState)
    : {
        key: 'random',
        direction: null,
      };
  const [sortState, setSortState] = useState<SortState>(defaultSortState);

  useEffect(() => {
    store.session.set(storeKey, JSON.stringify(sortState));
  }, [sortState, storeKey]);

  return useMemo(() => {
    return {
      sortState,
      setSortState,
    };
  }, [sortState]);
}
