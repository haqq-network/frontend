'use client';
import { useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useMediaQuery } from 'react-responsive';
import { useCosmosProvider, useWallet } from '@haqq/shell-shared';
import {
  SpinnerLoader,
  ValidatorIcon,
  Heading,
  Container,
  Checkbox,
  SearchInput,
  SortSelect,
} from '@haqq/shell-ui-kit';
import { ValidatorsListDesktop } from './validator-list-desktop';
import { ValidatorsListMobile } from './validator-list-mobile';
import { useStakingData } from '../hooks/use-staking-data';
import { SortDirection } from '../hooks/use-validator-sort';

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
  const route = useRouter();
  const isTablet = useMediaQuery({
    query: `(max-width: 1023px)`,
  });
  const { isHaqqWallet } = useWallet();

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
    <Container
      className={clsx(
        isHaqqWallet
          ? 'py-[24px] sm:py-[36px] lg:py-[68px]'
          : 'py-[52px] sm:py-[60px] lg:py-[80px]',
      )}
    >
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
              current={`${sortState.key}-${sortState.direction}`}
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
                route.push(`/staking/validator/${validatorAddress}`);
              }}
            />
          ) : (
            <ValidatorsListDesktop
              validators={validators}
              delegationInfo={delegationInfo}
              rewardsInfo={rewardsInfo}
              onValidatorClick={(validatorAddress: string) => {
                route.push(`/staking/validator/${validatorAddress}`);
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
