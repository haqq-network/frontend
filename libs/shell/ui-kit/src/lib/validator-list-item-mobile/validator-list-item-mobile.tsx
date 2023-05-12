import { PropsWithChildren, useMemo } from 'react';
import { formatUnits } from 'ethers/lib/utils';
import { bondStatusFromJSON } from 'cosmjs-types/cosmos/staking/v1beta1/staking';
import type { Validator, DelegationResponse, Reward } from '@evmos/provider';
import { useNavigate } from 'react-router-dom';

import clsx from 'clsx';

interface ValidatorListItemProps {
  validator: Validator;
  delegation?: DelegationResponse;
  reward?: Reward;
  stakingPool: number;
}

function ColumnLine({
  children,
  columnName,
}: PropsWithChildren<{ columnName: string }>) {
  return (
    <div className="flex items-center justify-between text-[13px] leading-[20px]">
      <span className="text-white/50">{columnName}</span>
      {children}
    </div>
  );
}

export function ValidatorListItemMobile({
  validator,
  reward,
  delegation,
  stakingPool,
}: ValidatorListItemProps) {
  const navigate = useNavigate();

  const validatorCommission = useMemo(() => {
    return (
      Number.parseFloat(validator.commission?.commission_rates?.rate ?? '0') *
      100
    ).toFixed(0);
  }, [validator.commission?.commission_rates]);

  const votingPower = useMemo(() => {
    return Number.parseInt(validator.tokens ?? '0') / 10 ** 18;
  }, [validator.tokens]);

  const userDelegate = useMemo(() => {
    if (delegation?.balance) {
      return Number.parseFloat(formatUnits(delegation.balance.amount));
    }

    return 0;
  }, [delegation]);

  const userRewards = useMemo(() => {
    if (reward?.reward.length) {
      return Number.parseFloat(reward?.reward[0].amount) / 10 ** 18;
    }

    return 0;
  }, [reward]);

  const votingPowerInPercents = useMemo(() => {
    return ((votingPower / stakingPool) * 100).toFixed(2);
  }, [votingPower, stakingPool]);

  return (
    <div
      className="flex flex-col"
      onClick={() => navigate(`validator/${validator.operator_address}`)}
    >
      <ColumnLine columnName="Name">
        <span className="text-white">{validator.description?.moniker}</span>
      </ColumnLine>
      <ColumnLine columnName="Status">
        <span
          className={clsx(
            validator.jailed && 'text-[#FF5454]',
            bondStatusFromJSON(validator.status) === 3
              ? 'text-[#01B26E]'
              : 'text-[#E3A13F]',
          )}
        >
          {validator.jailed && 'Jailed'}
          {bondStatusFromJSON(validator.status) === 3 ? 'Active' : 'Inactive'}
        </span>
      </ColumnLine>
      <ColumnLine columnName="Fee">
        <span className="text-white">{validatorCommission}%</span>
      </ColumnLine>
      <ColumnLine columnName="Voting power">
        <span className="text-white">{votingPower.toLocaleString()}</span>
      </ColumnLine>
      <ColumnLine columnName="Voting power %">
        <span className="text-white">{votingPowerInPercents}%</span>
      </ColumnLine>
      <ColumnLine columnName="Staked">
        <span className="text-white">{userDelegate.toLocaleString()}%</span>
      </ColumnLine>
      <ColumnLine columnName="Reward">
        <span className="text-white">{userRewards.toLocaleString()}%</span>
      </ColumnLine>
    </div>
  );
}
