import { Fragment, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ValidatorListItem } from '@haqq/staking/validator-list';
import { Card, Heading, SpinnerLoader, Text } from '@haqq/ui-kit';
import { useAddress } from '@haqq/hooks';
import { useCosmosService } from '@haqq/providers';

type Validator = {
  operator_address: string;
};

interface ValidatorListProps {
  validators?: Validator[];
  error?: any;
  status?: 'loading' | 'success' | 'error' | 'idle';
  title?: string;
}

export function ValidatorsList({
  validators,
  error,
  status,
  title,
}: ValidatorListProps) {
  const { getAccountDelegations, getRewardsInfo } = useCosmosService();
  const { haqqAddress } = useAddress();
  const { data: delegationInfo } = useQuery(['delegation', haqqAddress], () => {
    if (!haqqAddress) {
      return null;
    }

    return getAccountDelegations(haqqAddress);
  });

  const { data: rewardsInfo } = useQuery(['rewards', haqqAddress], () => {
    if (!haqqAddress) {
      return null;
    }
    console.log({ rewardsInfo });
    return getRewardsInfo(haqqAddress);
  });

  const getValidatorRewards = useCallback(
    (address: string) => {
      const rewards = rewardsInfo?.rewards?.find((rewardsItem: any) => {
        return rewardsItem.validator_address === address;
      });

      return rewards;
    },
    [rewardsInfo?.rewards],
  );

  const getDelegationInfo = useCallback(
    (address: string) => {
      const delegationAmount = delegationInfo?.delegation_responses?.find(
        (delegation: any) => {
          return delegation.delegation.validator_address === address;
        },
      );

      return delegationAmount;
    },
    [delegationInfo],
  );

  return (
    <div className="mx-auto w-full flex flex-col flex-1">
      <Heading level={3} className="mb-4">
        {title}
      </Heading>
      <Card className="!p-0 flex flex-col flex-1">
        {status === 'loading' && (
          <div className="flex-1 flex flex-col space-y-8 items-center justify-center">
            <SpinnerLoader />
            <Text block>Fetching validators list</Text>
          </div>
        )}
        {status === 'error' && <p>Error: {(error as any).message}</p>}
        {status === 'success' && (
          <Fragment>
            <div className="px-6 py-3 border-b border-islamic-black-100/20">
              <div className="flex items-center justify-between space-x-6 font-semibold">
                <div className="w-1/3">
                  <div className="font-semibold">Name</div>
                </div>
                <div className="w-[100px] text-center">Status</div>
                <div className="w-[50px] text-center">Fee</div>
                <div className="flex-1 text-right">Power</div>
                <div className="flex-1 text-right">Staked</div>
                <div className="flex-1 text-right">Rewards</div>
              </div>
            </div>

            <div className="flex-1 flex">
              <div className="w-full inset-0">
                {(validators as any).map((validator: any, index: number) => {
                  const delegationInfo = getDelegationInfo(
                    validator.operator_address,
                  );
                  const rewardsInfo = getValidatorRewards(
                    validator.operator_address,
                  );

                  return (
                    <Link
                      to={`validator/${validator.operator_address}`}
                      key={`validator-${index}`}
                    >
                      <ValidatorListItem
                        validator={validator}
                        delegation={delegationInfo}
                        reward={rewardsInfo}
                        // index={pageIndex * 100 + index + 1}
                        // symbol="islm"
                        // onClick={() => {
                        //   setCurrentValidatorAddress(validator.operator_address);
                        //   setValidatorInfoModalOpen(true);
                        // }}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          </Fragment>
        )}
      </Card>
    </div>
  );
}
