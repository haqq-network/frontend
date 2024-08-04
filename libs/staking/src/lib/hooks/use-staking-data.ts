'use client';
import { useMemo, useState } from 'react';
import { DelegationResponse, Validator } from '@evmos/provider';
import { formatEther } from 'viem';
import {
  useAddress,
  useStakingValidatorListQuery,
  useStakingRewardsQuery,
  useStakingDelegationQuery,
  useStakingPoolQuery,
  useStakingParamsQuery,
} from '@haqq/shell-shared';
import { toFixedAmount } from '@haqq/shell-ui-kit/server';
import { useFilteredValidators } from './use-validator-filter';
import {
  useSortedValidators,
  useValidatorsSortState,
} from './use-validator-sort';
import { sortValidatorsByToken } from '../utils/sort-validators';
import { splitValidators } from '../utils/split-validators';

function getDelegatedValidatorsAddresses(
  delegations: DelegationResponse[] | null | undefined,
) {
  if (!delegations) {
    return [];
  }

  return delegations
    .map((del) => {
      const amount = toFixedAmount(
        Number.parseFloat(formatEther(BigInt(del.balance.amount))),
      );
      if (amount && amount > 0) {
        return del.delegation.validator_address;
      }

      return null;
    })
    .filter(Boolean);
}

export function useStakingData({
  showOnlyMyDelegation = false,
  inactiveValidatorsVisible = false,
  seedPhrase = '',
}: {
  showOnlyMyDelegation?: boolean;
  inactiveValidatorsVisible?: boolean;
  seedPhrase?: string;
} = {}) {
  const { haqqAddress, ethAddress } = useAddress();
  const {
    data: validators,
    error,
    status,
  } = useStakingValidatorListQuery(1000);
  const { data: rewardsInfo } = useStakingRewardsQuery(haqqAddress);
  const { data: delegationInfo } = useStakingDelegationQuery(haqqAddress);
  const { data: stakingPool } = useStakingPoolQuery();
  const { data: stakingParams } = useStakingParamsQuery();
  const { sortState, setSortState } = useValidatorsSortState();
  const [isInactiveValidatorsVisible, setInactiveValidatorsVisible] = useState(
    inactiveValidatorsVisible,
  );
  const [isShowMyDelegation, setShowMyDelegation] =
    useState(showOnlyMyDelegation);
  const [filter, setFilter] = useState('');

  const splittedValidators = useMemo(() => {
    if (validators === undefined) {
      return [];
    }

    const { active, inactive, jailed } = splitValidators(validators);

    return [
      ...sortValidatorsByToken(active),
      ...sortValidatorsByToken(inactive),
      ...sortValidatorsByToken(jailed),
    ];
  }, [validators]);

  const valWithDelegationAddr = useMemo(() => {
    if (!delegationInfo || !haqqAddress) {
      return [];
    }

    const delegatedVals = getDelegatedValidatorsAddresses(
      delegationInfo.delegation_responses,
    );

    return delegatedVals;
  }, [delegationInfo, haqqAddress]);

  const validatorToFilterAndSort = useMemo(() => {
    if (splittedValidators.length === 0) {
      return [] as Validator[];
    }

    const filteredValidators = isInactiveValidatorsVisible
      ? splittedValidators
      : splittedValidators.filter((val) => {
          return val.status === 'BOND_STATUS_BONDED';
        });

    if (isShowMyDelegation) {
      const accountDelegations = filteredValidators.filter((validator) => {
        return valWithDelegationAddr.includes(validator.operator_address);
      });

      return accountDelegations;
    }

    return filteredValidators;
  }, [
    isInactiveValidatorsVisible,
    isShowMyDelegation,
    splittedValidators,
    valWithDelegationAddr,
  ]);

  const totalStaked = useMemo(() => {
    return Number.parseInt(stakingPool?.bonded_tokens ?? '0') / 10 ** 18;
  }, [stakingPool?.bonded_tokens]);

  const { valsTotal, valsActive } = useMemo(() => {
    return {
      valsTotal: stakingParams?.max_validators ?? 0,
      valsActive: isInactiveValidatorsVisible
        ? validators?.length
        : validatorToFilterAndSort.length,
    };
  }, [
    stakingParams?.max_validators,
    isInactiveValidatorsVisible,
    validators?.length,
    validatorToFilterAndSort.length,
  ]);

  const filteredValidators = useFilteredValidators(
    validatorToFilterAndSort,
    filter,
  );

  const sortedValidators = useSortedValidators(
    filteredValidators,
    sortState,
    totalStaked,
    rewardsInfo,
    delegationInfo,
    seedPhrase,
  );

  const returnObject = useMemo(() => {
    return {
      totalStaked,
      valsTotal,
      valsActive,
      status,
      error,
      validators: sortedValidators,
      delegationInfo,
      rewardsInfo,
      isInactiveValidatorsVisible,
      setInactiveValidatorsVisible,
      isShowMyDelegation,
      setShowMyDelegation,
      isWalletConnected: haqqAddress && ethAddress,
      filter,
      setFilter,
      sortState,
      setSortState,
    };
  }, [
    totalStaked,
    valsTotal,
    valsActive,
    status,
    error,
    sortedValidators,
    delegationInfo,
    rewardsInfo,
    isInactiveValidatorsVisible,
    isShowMyDelegation,
    haqqAddress,
    ethAddress,
    filter,
    sortState,
    setSortState,
  ]);

  return returnObject;
}
