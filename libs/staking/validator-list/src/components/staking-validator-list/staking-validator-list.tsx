import { Fragment, useCallback, useMemo } from 'react';
import { Container, Heading } from '@haqq/ui-kit';
import { ValidatorsList } from '@haqq/staking/ui-kit';
import { StakingInfo } from '@haqq/staking/validator-details';
import { useQuery } from 'wagmi';
import { useCosmosService } from '@haqq/providers';
import { sortValidatorsByToken, splitValidators } from '@haqq/staking/utils';
import { useAddress } from '@haqq/hooks';

export function StakingValidatorList() {
  const { getAllValidators, getRewardsInfo, getAccountDelegations } =
    useCosmosService();

  const {
    data: validatorsList,
    error,
    status,
  } = useQuery(['validators'], () => {
    return getAllValidators(1000);
  });

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

  const sortedAllValidators = useMemo(() => {
    const { active, inactive, jailed } = splitValidators(validatorsList);
    const sortedVals = [
      ...sortValidatorsByToken(active),
      ...sortValidatorsByToken(inactive),
      ...sortValidatorsByToken(jailed),
    ];

    return sortedVals;
  }, [validatorsList]);

  const sortedDelegatedValidators = useMemo(() => {
    const { active, inactive, jailed } = splitValidators(validatorsList);
    const sortedVals = [
      ...sortValidatorsByToken(active),
      ...sortValidatorsByToken(inactive),
      ...sortValidatorsByToken(jailed),
    ];
    const filteredVals = sortedVals.filter((el) => {
      const rewardsInfo = getValidatorRewards(el.operator_address);
      return rewardsInfo;
    });
    console.log({ filteredVals });

    return filteredVals;
  }, [validatorsList]);

  return (
    <Fragment>
      <Container>
        <Heading level={2} className="mb-4">
          Staking
        </Heading>
        <StakingInfo />
      </Container>

      <Container className="flex flex-1 flex-col space-y-4">
        <ValidatorsList
          validators={sortedDelegatedValidators}
          error={error}
          status={status}
          title="Active Delegation"
        />
        <ValidatorsList
          validators={sortedAllValidators}
          error={error}
          status={status}
          title="Validators"
        />
      </Container>
    </Fragment>
  );
}
