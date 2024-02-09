import { useCallback, useMemo } from 'react';
import { formatUnits } from 'viem';
import {
  useStakingPoolQuery,
  useStakingValidatorListQuery,
} from '@haqq/shared';
import { formatPercents } from '@haqq/shell-ui-kit';
import { sortValidatorsByToken } from '../sort-validators';
import { splitValidators } from '../split-validators';

interface ValidatorWithShare {
  operator_address: string;
  share: number;
  cumulativeShare: number;
}

export function useValidatorsShares() {
  const { data: validatorsList } = useStakingValidatorListQuery(1000);
  const { data: stakingPool } = useStakingPoolQuery();
  const votingPowerPercent = 30;

  const sortedValidators = useMemo(() => {
    const { active } = splitValidators(validatorsList ?? []);
    return sortValidatorsByToken(active ?? []);
  }, [validatorsList]);

  const totalStaked = useMemo(() => {
    return Number.parseFloat(
      formatUnits(BigInt(stakingPool?.bonded_tokens ?? '0'), 18),
    );
  }, [stakingPool?.bonded_tokens]);

  const validatorsWithShares = useMemo(() => {
    let cumulativeShare = 0;

    return sortedValidators.map<ValidatorWithShare>((validator) => {
      const votingPower = Number.parseFloat(
        formatUnits(BigInt(validator.tokens), 18),
      );
      const share = votingPower / totalStaked;
      cumulativeShare += share;

      return {
        operator_address: validator.operator_address,
        share: formatPercents(share.toString()),
        cumulativeShare: formatPercents(cumulativeShare.toString()),
      };
    });
  }, [sortedValidators, totalStaked]);

  const checkTopShare = useCallback(
    (address: string): boolean => {
      const foundValidator = validatorsWithShares.find((validator) => {
        return validator.operator_address === address;
      });

      return foundValidator
        ? foundValidator.cumulativeShare <= votingPowerPercent
        : false;
    },
    [validatorsWithShares],
  );

  return { validatorsWithShares, checkTopShare, votingPowerPercent };
}
