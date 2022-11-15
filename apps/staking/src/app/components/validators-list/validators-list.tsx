import { Fragment, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useCosmosService } from '../../hooks/useCosmosService';
import { ValidatorListItem } from '../validator-list-item/validator-list-item';
import { Card, SpinnerLoader, Text } from '@haqq/ui-kit';
import { splitValidators } from '../../utils/splitValidators';
import { sortValidatorsByToken } from '../../utils/sortValidators';
import { useAddress } from '@haqq/hooks';

export function ValidatorsList() {
  const { getAccountDelegations, getAllValidators, getRewardsInfo } =
    useCosmosService();
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

    return getRewardsInfo(haqqAddress);
  });
  const {
    data: validatorsList,
    error,
    status,
  } = useQuery(['validators'], () => {
    return getAllValidators(1000);
  });

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
    const { active, inactive, jailed } = splitValidators(validatorsList);
    const sortedVals = [
      ...sortValidatorsByToken(active),
      ...sortValidatorsByToken(inactive),
      ...sortValidatorsByToken(jailed),
    ];

    return sortedVals;
  }, [validatorsList]);

  return (
    <div className="mx-auto w-full max-w-6xl flex">
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

            <div className="flex-1 flex relative">
              <div className="overflow-y-scroll absolute inset-0">
                {(sortedValidators as any).map(
                  (validator: any, index: number) => {
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
                  },
                )}
              </div>
            </div>
          </Fragment>
        )}
      </Card>
    </div>
  );
}
