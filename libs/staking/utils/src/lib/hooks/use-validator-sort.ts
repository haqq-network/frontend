import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  DistributionRewardsResponse,
  GetDelegationsResponse,
  Validator,
} from '@evmos/provider';
import store from 'store2';
import { useAddress } from '@haqq/shared';
import {
  createSortValidatorsByStakedOrReward,
  createSortValidatorsByVotingPowerPercent,
  randomSort,
  sortValidatorsByFee,
  sortValidatorsByName,
  sortValidatorsByStatus,
  sortValidatorsByVotingPower,
} from '../sort-validators';

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
        return randomSort(validators);
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
          sortedValidators.sort(sortValidatorsByFee);
          break;

        case 'votingPower':
          sortedValidators.sort(sortValidatorsByVotingPower);
          break;

        case 'votingPowerPercent':
          sortedValidators.sort(
            createSortValidatorsByVotingPowerPercent(totalStaked),
          );
          break;

        case 'staked':
          sortedValidators.sort(
            createSortValidatorsByStakedOrReward(getDelegationsInfo),
          );
          break;

        case 'reward':
          sortedValidators.sort(
            createSortValidatorsByStakedOrReward(getRewardsInfo),
          );
          break;

        default:
          break;
      }

      // Reversing for descending order if required
      if (state.direction === 'desc') {
        sortedValidators.reverse();
      }

      return sortedValidators;
    },

    [totalStaked],
  );

  return useMemo(() => {
    return sortValidators(validators, sortState);
  }, [validators, sortState]);
}

export function useValidatorsSortState() {
  const { ethAddress } = useAddress();
  const storeKey = `validators_sort_state_${ethAddress}`;
  const storedSortState: string | null = store.get(storeKey);
  const defaultSortState: SortState = storedSortState
    ? JSON.parse(storedSortState)
    : {
        key: 'random',
        direction: null,
      };
  const [sortState, setSortState] = useState<SortState>(defaultSortState);

  useEffect(() => {
    store.set(storeKey, JSON.stringify(sortState));
  }, [sortState, storeKey]);

  return useMemo(() => {
    return {
      sortState,
      setSortState,
    };
  }, [sortState]);
}
