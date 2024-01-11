import { useCallback, useEffect, useMemo, useState } from 'react';
import { DelegationResponse, Validator } from '@evmos/provider';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import { formatEther } from 'viem';
import {
  useAddress,
  useStakingValidatorListQuery,
  useStakingRewardsQuery,
  useStakingDelegationQuery,
  useCosmosProvider,
  useStakingPoolQuery,
  toFixedAmount,
  useStakingParamsQuery,
} from '@haqq/shared';
import {
  SpinnerLoader,
  ValidatorIcon,
  Heading,
  Container,
  Checkbox,
  SearchInput,
  SortSelect,
} from '@haqq/shell-ui-kit';
import {
  ValidatorsListDesktop,
  ValidatorsListMobile,
} from '@haqq/staking/ui-kit';
import {
  SortDirection,
  sortValidatorsByToken,
  splitValidators,
  useFilteredValidators,
  useSortedValidators,
  useValidatorsSortState,
} from '@haqq/staking/utils';

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

function useStakingData() {
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
  const [isInactiveValidatorsVisible, setInactiveValidatorsVisible] =
    useState(false);
  const [isShowMyDelegation, setShowMyDelegation] = useState(false);
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
  );

  useEffect(() => {
    if (isShowMyDelegation === true) {
      setInactiveValidatorsVisible(true);
    }
  }, [isShowMyDelegation]);

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

export function StakingValidatorList() {
  const {
    totalStaked,
    valsTotal,
    valsActive,
    status,
    error,
    validators,
    delegationInfo,
    rewardsInfo,
    isInactiveValidatorsVisible,
    setInactiveValidatorsVisible,
    isShowMyDelegation,
    setShowMyDelegation,
    filter,
    setFilter,
    sortState,
    setSortState,
    isWalletConnected,
  } = useStakingData();
  const navigate = useNavigate();
  const isTablet = useMediaQuery({
    query: `(max-width: 1023px)`,
  });

  const handleMobileSortChange = useCallback(
    (mobileSortKey: string) => {
      if (mobileSortKey === 'random') {
        setSortState({
          key: 'random',
          direction: null,
        });
      }

      const [key, direction] = mobileSortKey.split('-') as [
        string,
        SortDirection,
      ];

      setSortState({
        key,
        direction,
      });
    },
    [setSortState],
  );

  const handleDesktopSortClick = useCallback(
    (key: string) => {
      setSortState((state) => {
        return {
          key,
          direction: state?.direction === 'asc' ? 'desc' : 'asc',
        };
      });
    },
    [setSortState],
  );

  const validatorsCounterText = useMemo(() => {
    if (!validators) {
      return null;
    }

    if (isShowMyDelegation) {
      return `${validators.length}`;
    }

    if (filter && filter !== '') {
      return `${validators.length}/${valsTotal}`;
    }

    return `${valsActive}/${valsTotal}`;
  }, [filter, isShowMyDelegation, validators, valsActive, valsTotal]);

  return (
    <Container className="py-[52px] sm:py-[60px] lg:py-[80px]">
      <div className="flex flex-col gap-[32px]">
        <div className="flex flex-col gap-[24px] lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-row items-center">
            <ValidatorIcon />
            <Heading level={3} className="mb-[-2px] ml-[8px]">
              Validators
              {status !== 'pending' && (
                <span className="text-white/50">
                  &nbsp;(<span>{validatorsCounterText}</span>)
                </span>
              )}
            </Heading>
          </div>

          <div className="flex flex-col gap-[12px] lg:flex-row lg:items-center lg:gap-[24px]">
            <SearchInput value={filter} onChange={setFilter} />
            <SortSelect
              placeholder="Sorting by"
              current={
                sortState.key === 'random'
                  ? 'random'
                  : `${sortState.key}-${sortState.direction}`
              }
              onChange={handleMobileSortChange}
              variants={[
                { id: 'random', title: 'Random' },
                { id: 'name-asc', title: 'By name (a-z)' },
                { id: 'name-desc', title: 'By name (z-a)' },
                { id: 'power-asc', title: 'By power (a-z)' },
                { id: 'power-desc', title: 'By power (z-a)' },
                { id: 'fee-asc', title: 'By fee (a-z)' },
                { id: 'fee-desc', title: 'By fee (z-a)' },
              ]}
              className="lg:hidden"
            />

            <div className="flex flex-row gap-[24px]">
              <div className="leading-[0]">
                <Checkbox
                  onChange={setShowMyDelegation}
                  disabled={!isWalletConnected}
                  value={isWalletConnected ? isShowMyDelegation : false}
                >
                  My delegations
                </Checkbox>
              </div>
              <div className="leading-[0]">
                <Checkbox
                  onChange={setInactiveValidatorsVisible}
                  value={isInactiveValidatorsVisible}
                >
                  Show Inactive
                </Checkbox>
              </div>
            </div>
          </div>
        </div>

        {status === 'pending' && (
          <div className="pointer-events-none mx-auto flex min-h-[320px] w-full flex-1 select-none">
            <div className="flex min-h-full flex-1 flex-col items-center justify-center space-y-8">
              <SpinnerLoader />
              <div className="font-guise text-[10px] uppercase leading-[1.2em]">
                Fetching validators list
              </div>
            </div>
          </div>
        )}

        {status === 'error' && (
          <p>Error: {error?.message ?? 'unknown error'}</p>
        )}

        {status === 'success' &&
          (isTablet ? (
            <ValidatorsListMobile
              validators={validators}
              delegationInfo={delegationInfo}
              rewardsInfo={rewardsInfo}
              totalStaked={totalStaked}
              onValidatorClick={(validatorAddress: string) => {
                navigate(`validator/${validatorAddress}`);
              }}
            />
          ) : (
            <ValidatorsListDesktop
              validators={validators}
              delegationInfo={delegationInfo}
              rewardsInfo={rewardsInfo}
              onValidatorClick={(validatorAddress: string) => {
                navigate(`validator/${validatorAddress}`);
              }}
              totalStaked={totalStaked}
              onDesktopSortClick={handleDesktopSortClick}
              sortState={sortState}
            />
          ))}
      </div>
    </Container>
  );
}

export function ValidatorList() {
  const { isReady } = useCosmosProvider();

  if (!isReady) {
    return null;
  }

  return <StakingValidatorList />;
}
