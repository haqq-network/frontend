import { useCallback } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Heading,
  ListIcon,
  OrangeLink,
  SpinnerLoader,
} from '@haqq/shell-ui-kit';
import {
  ValidatorsListDesktop,
  ValidatorsListMobile,
} from '@haqq/staking/ui-kit';
import { useStakingData } from '@haqq/staking/utils';

export function DelegationsBlock() {
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
  });
  const navigate = useNavigate();
  const isTablet = useMediaQuery({
    query: `(max-width: 1023px)`,
  });

  // const handleMobileSortChange = useCallback(
  //   (mobileSortKey: string) => {
  //     if (mobileSortKey === 'random') {
  //       setSortState({
  //         key: 'random',
  //         direction: null,
  //       });
  //     }

  //     const [key, direction] = mobileSortKey.split('-') as [
  //       string,
  //       SortDirection,
  //     ];

  //     setSortState({
  //       key,
  //       direction,
  //     });
  //   },
  //   [setSortState],
  // );

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

      <div>
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
      </div>

      {status === 'error' && <p>Error: {(error as Error).message}</p>}

      {status === 'success' && (
        <div>
          {validators.length ? (
            <div>
              {isTablet ? (
                <ValidatorsListMobile
                  validators={validators}
                  delegationInfo={delegationInfo}
                  rewardsInfo={rewardsInfo}
                  onValidatorClick={(validatorAddress: string) => {
                    navigate(`/staking/validator/${validatorAddress}`);
                  }}
                  totalStaked={totalStaked}
                />
              ) : (
                <ValidatorsListDesktop
                  validators={validators}
                  delegationInfo={delegationInfo}
                  rewardsInfo={rewardsInfo}
                  onValidatorClick={(validatorAddress: string) => {
                    navigate(`/staking/validator/${validatorAddress}`);
                  }}
                  totalStaked={totalStaked}
                  sortState={sortState}
                  onDesktopSortClick={handleDesktopSortClick}
                />
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-[20px]">
              <div className="mb-[4px] text-[14px] leading-[22px] text-white/50">
                You don't have any active delegations
              </div>
              <Link to="/staking" className="leading-[0]">
                <OrangeLink>Go to Staking</OrangeLink>
              </Link>
            </div>
          )}
        </div>
      )}
    </Container>
  );
}
