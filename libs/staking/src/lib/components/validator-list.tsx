'use client';
import { useCallback, useMemo } from 'react';
import { useTranslate } from '@tolgee/react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useMediaQuery } from 'usehooks-ts';
import { useWallet } from '@haqq/shell-shared';
import { Checkbox, SearchInput, SortSelect } from '@haqq/shell-ui-kit';
import {
  SpinnerLoader,
  ValidatorIcon,
  Heading,
  Container,
} from '@haqq/shell-ui-kit/server';
import { ValidatorsListDesktop } from './validator-list-desktop';
import { ValidatorsListMobile } from './validator-list-mobile';
import { useStakingData } from '../hooks/use-staking-data';
import { SortDirection } from '../hooks/use-validator-sort';

export function ValidatorList({
  isMobileUserAgent,
  seedPhrase,
}: {
  isMobileUserAgent: boolean;
  seedPhrase: string;
}) {
  const { t } = useTranslate();
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
  } = useStakingData({ seedPhrase });
  const route = useRouter();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
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
              {t('validators', 'Validators', { ns: 'staking' })}
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
              placeholder={t('sort-by', 'Sorting by', { ns: 'staking' })}
              current={`${sortState.key}-${sortState.direction}`}
              onChange={handleMobileSortChange}
              variants={[
                {
                  id: 'random',
                  title: t('random', 'Random', { ns: 'staking' }),
                },
                {
                  id: 'name-asc',
                  title: t('name-asc', 'By name (a-z)', { ns: 'staking' }),
                },
                {
                  id: 'name-desc',
                  title: t('name-desc', 'By name (z-a)', { ns: 'staking' }),
                },
                {
                  id: 'power-asc',
                  title: t('power-asc', 'By power (a-z)', { ns: 'staking' }),
                },
                {
                  id: 'power-desc',
                  title: t('power-desc', 'By power (z-a)', { ns: 'staking' }),
                },
                {
                  id: 'fee-asc',
                  title: t('fee-asc', 'By fee (a-z)', { ns: 'staking' }),
                },
                {
                  id: 'fee-desc',
                  title: t('fee-desc', 'By fee (z-a)', { ns: 'staking' }),
                },
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
                  {t('my-delegations', 'My delegations', { ns: 'common' })}
                </Checkbox>
              </div>
              <div className="leading-[0]">
                <Checkbox
                  onChange={setInactiveValidatorsVisible}
                  value={isInactiveValidatorsVisible}
                >
                  {t('show-inactive', 'Show inactive', { ns: 'staking' })}
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
                {t('fetching-validators-message', 'Fetching validators list', {
                  ns: 'staking',
                })}
              </div>
            </div>
          </div>
        )}

        {status === 'error' && (
          // eslint-disable-next-line i18next/no-literal-string
          <p>Error: {error?.message ?? 'unknown error'}</p>
        )}

        {status === 'success' && (
          <div>
            {isMobileUserAgent || !isDesktop ? (
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
            )}
          </div>
        )}
      </div>
    </Container>
  );
}
