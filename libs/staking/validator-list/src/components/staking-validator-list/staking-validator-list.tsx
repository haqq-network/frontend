import { Fragment, useCallback, useMemo } from 'react';
import {
  useAddress,
  useStakingValidatorListQuery,
  useStakingRewardsQuery,
  useStakingDelegationQuery,
} from '@haqq/shared';
import { StakingInfo, ValidatorsList } from '@haqq/staking/ui-kit';
import { sortValidatorsByToken, splitValidators } from '@haqq/staking/utils';
import { Heading } from '@haqq/website/ui-kit';
import { Validator } from '@evmos/provider';
import { SpinnerLoader } from '@haqq/ui-kit';

export function StakingValidatorList() {
  const { haqqAddress } = useAddress();
  const {
    data: validatorsList,
    error,
    status,
  } = useStakingValidatorListQuery(1000);
  const { data: rewardsInfo } = useStakingRewardsQuery(haqqAddress);
  const { data: delegationInfo } = useStakingDelegationQuery(haqqAddress);

  const getValidatorRewards = useCallback(
    (address: string) => {
      const rewards = rewardsInfo?.rewards?.find((rewardsItem: any) => {
        return rewardsItem.validator_address === address;
      });

      return rewards;
    },
    [rewardsInfo?.rewards],
  );

  const sortedValidators = useMemo(() => {
    const { active, inactive, jailed } = splitValidators(validatorsList ?? []);

    return [
      ...sortValidatorsByToken(active),
      ...sortValidatorsByToken(inactive),
      ...sortValidatorsByToken(jailed),
    ];
  }, [validatorsList]);

  const [delegatedValidators, otherValidators] = useMemo(() => {
    if (sortedValidators.length === 0) {
      return [[], []] as [Validator[], Validator[]];
    }

    const delegated: Validator[] = [];
    const others: Validator[] = [];

    for (const validator of sortedValidators) {
      const rewardsInfo = getValidatorRewards(validator.operator_address);
      if (rewardsInfo) {
        delegated.push(validator);
      } else {
        others.push(validator);
      }
    }

    return [delegated, others];
  }, [getValidatorRewards, sortedValidators]);

  return (
    <Fragment>
      <section className="flex flex-col w-full px-[16px] sm:px-[63px] lg:px-[79px] lg:py-[68px]">
        <div className="font-serif text-[28px] sm:text-[48px] lg:text-[70px] uppercase leading-none">
          Staking
        </div>
      </section>

      <StakingInfo />

      <section className="flex flex-col w-full px-[16px] sm:px-[63px] lg:px-[79px] lg:py-[68px]">
        <div className="mb-[24px] flex flex-row items-center">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3 4C3 2.89543 3.89543 2 5 2H19C20.1046 2 21 2.89543 21 4V9C21 10.1046 20.1046 11 19 11H5C3.89543 11 3 10.1046 3 9V4ZM19 4H5V9H19V4ZM7 7.5H9V5.5H7V7.5ZM10 7.5H12V5.5H10V7.5ZM3 15C3 13.8954 3.89543 13 5 13H19C20.1046 13 21 13.8954 21 15V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V15ZM19 20V15H5V20H19ZM7 18.5H9V16.5H7V18.5ZM10 18.5H12V16.5H10V18.5Z"
              fill="currentColor"
            />
          </svg>
          <Heading level={3} className="ml-[8px]">
            Validators
          </Heading>
        </div>

        <div>
          {status === 'loading' && (
            <div className="mx-auto w-full max-w-6xl flex-1 flex select-none pointer-events-none py-20">
              <div className="flex-1 flex flex-col space-y-8 items-center justify-center min-h-full">
                <SpinnerLoader className="text-white/10 !fill-haqq-orange w-10 h-10" />
                <div className="font-sans text-[10px] leading-[1.2em] uppercase">
                  Fetching validators list
                </div>
              </div>
            </div>
          )}
          {status === 'error' && <p>Error: {error.message}</p>}
          {status === 'success' && (
            <div className="flex flex-col gap-[24px]">
              <div>
                <div className="text-[20px] leading-[26px] text-white/50 font-serif mb-[8px]">
                  My delegations
                </div>
                {delegatedValidators.length ? (
                  <ValidatorsList
                    validators={delegatedValidators}
                    delegationInfo={delegationInfo}
                    rewardsInfo={rewardsInfo}
                  />
                ) : (
                  <div className="text-center py-[48px]">
                    <Heading level={3}>
                      You don't have active delegations
                    </Heading>
                  </div>
                )}
              </div>
              <div>
                <div className="text-[20px] leading-[26px] text-white/50 font-serif mb-[8px]">
                  Other validators
                </div>
                <ValidatorsList
                  validators={otherValidators}
                  delegationInfo={delegationInfo}
                  rewardsInfo={rewardsInfo}
                />
              </div>
            </div>
          )}
        </div>
      </section>
    </Fragment>
  );
}
