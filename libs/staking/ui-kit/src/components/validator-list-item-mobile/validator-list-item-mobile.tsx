import {
  ValidatorListItemMobile as ValidatorListItemMobileComponent,
  formatNumber,
} from '@haqq/shell-ui-kit';
import type { Validator, DelegationResponse, Reward } from '@evmos/provider';
import { useCallback, useMemo } from 'react';
import { formatUnits, parseUnits } from 'viem';

export function ValidatorListItemMobile({
  validator,
  reward,
  delegation,
  stakingPool,
  onClick,
}: {
  validator: Validator;
  delegation?: DelegationResponse;
  reward?: Reward;
  stakingPool: number;
  onClick: (validatorAddress: string) => void;
}) {
  const validatorCommission = useMemo(() => {
    return (
      Number.parseFloat(validator.commission?.commission_rates?.rate ?? '0') *
      100
    ).toFixed(0);
  }, [validator.commission?.commission_rates]);
  const votingPower = useMemo(() => {
    return Number.parseFloat(formatUnits(BigInt(validator.tokens), 18));
  }, [validator.tokens]);
  const userDelegate = useMemo(() => {
    if (delegation?.balance) {
      return Number.parseFloat(
        formatUnits(BigInt(delegation.balance.amount), 18),
      );
    }

    return 0;
  }, [delegation]);
  const userRewards = useMemo(() => {
    if (reward?.reward.length) {
      return Number.parseFloat(
        formatUnits(parseUnits(reward.reward[0].amount, 0), 18),
      );
    }

    return 0;
  }, [reward]);
  const votingPowerInPercents = useMemo(() => {
    return ((votingPower / stakingPool) * 100).toFixed(2);
  }, [votingPower, stakingPool]);

  const getStatus = useCallback(() => {
    if (validator.jailed) {
      return 'jailed';
    }

    if (validator.status === 'BOND_STATUS_BONDED') {
      return 'active';
    }

    return 'inactive';
  }, [validator.jailed, validator.status]);

  return (
    <div
      onClick={() => {
        onClick(validator.operator_address);
      }}
    >
      <ValidatorListItemMobileComponent
        validatorName={validator.description.moniker}
        fee={`${validatorCommission}%`}
        reward={formatNumber(userRewards)}
        staked={formatNumber(userDelegate)}
        votingPowerPercent={votingPowerInPercents}
        votingPower={formatNumber(votingPower)}
        status={getStatus()}
      />
    </div>
  );
}
