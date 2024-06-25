'use client';
import { useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMediaQuery } from 'usehooks-ts';
import {
  ValidatorsListDesktop,
  ValidatorsListMobile,
  useStakingData,
} from '@haqq/shell-staking';
import {
  Container,
  Heading,
  ListIcon,
  OrangeLink,
  // SpinnerLoader,
} from '@haqq/shell-ui-kit/server';

export function DelegationsBlock({
  isMobileUserAgent,
  seedPhrase,
}: {
  isMobileUserAgent: boolean;
  seedPhrase: string;
}) {
  const {
    totalStaked,
    status,
    error,
    validators,
    delegationInfo,
    rewardsInfo,
    sortState,
    setSortState,
  } = useStakingData({
    showOnlyMyDelegation: true,
    inactiveValidatorsVisible: false,
    seedPhrase,
  });
  const router = useRouter();
  const isTablet = useMediaQuery('(max-width: 1023px)');

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

  return (
    <Container>
      <div className="mb-[24px] flex flex-row items-center">
        <ListIcon />
        <Heading level={3} className="mb-[-2px] ml-[8px]">
          My delegations
        </Heading>
      </div>

      {/* <div>
        {status === 'pending' && (
          <div className="pointer-events-none mx-auto flex min-h-[220px] w-full flex-1 select-none">
            <div className="flex min-h-full flex-1 flex-col items-center justify-center space-y-8">
              <SpinnerLoader />
              <div className="font-guise text-[10px] uppercase leading-[1.2em]">
                Fetching validators list
              </div>
            </div>
          </div>
        )}
      </div> */}

      {status === 'error' && <p>Error: {(error as Error).message}</p>}

      {status === 'success' && (
        <div>
          {validators.length ? (
            <div>
              {isMobileUserAgent ? (
                <ValidatorsListMobile
                  validators={validators}
                  delegationInfo={delegationInfo}
                  rewardsInfo={rewardsInfo}
                  onValidatorClick={(validatorAddress: string) => {
                    router.push(`/staking/validator/${validatorAddress}`);
                  }}
                  totalStaked={totalStaked}
                />
              ) : (
                <div>
                  {isTablet ? (
                    <ValidatorsListMobile
                      validators={validators}
                      delegationInfo={delegationInfo}
                      rewardsInfo={rewardsInfo}
                      onValidatorClick={(validatorAddress: string) => {
                        router.push(`/staking/validator/${validatorAddress}`);
                      }}
                      totalStaked={totalStaked}
                    />
                  ) : (
                    <ValidatorsListDesktop
                      validators={validators}
                      delegationInfo={delegationInfo}
                      rewardsInfo={rewardsInfo}
                      onValidatorClick={(validatorAddress: string) => {
                        router.push(`/staking/validator/${validatorAddress}`);
                      }}
                      totalStaked={totalStaked}
                      sortState={sortState}
                      onDesktopSortClick={handleDesktopSortClick}
                    />
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-[20px]">
              <div className="mb-[4px] text-[14px] leading-[22px] text-white/50">
                You don't have any active delegations
              </div>
              <Link href="/staking" className="leading-[0]">
                <OrangeLink>Go to Staking</OrangeLink>
              </Link>
            </div>
          )}
        </div>
      )}
    </Container>
  );
}
