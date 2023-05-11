import { useMemo } from 'react';
import { formatUnits } from 'ethers/lib/utils';
import { bondStatusFromJSON } from 'cosmjs-types/cosmos/staking/v1beta1/staking';
import type { Validator, DelegationResponse, Reward } from '@evmos/provider';
import { ValidatorStatus } from '../validator-status/validator-status';
import { useNavigate } from 'react-router-dom';

export interface ValidatorListItemProps {
  validator: Validator;
  delegation?: DelegationResponse;
  reward?: Reward;
  stakingPool: number;
}

export function ValidatorListItem({
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
    <tr
      className="border-[#FFFFFF26] border-t text-[16px] leading-[26px] hover:bg-white/5 cursor-pointer transition-[background] duration-75"
      onClick={() => {
        navigate(`validator/${validator.operator_address}`);
      }}
    >
      <td className="p-[12px]">
        <div>{validator.description?.moniker}</div>
      </td>
      <td className="text-left p-[12px]">
        <ValidatorStatus
          jailed={validator.jailed}
          status={bondStatusFromJSON(validator.status)}
        />
      </td>
      <td className="text-left p-[12px]">
        <div>{validatorCommission}%</div>
      </td>
      <td className="text-right p-[12px]">
        <div>{votingPower.toLocaleString()}</div>
      </td>
      <td className="text-right p-[12px]">
        <div className="text-gray-400 text-sm">{votingPowerInPercents}%</div>
      </td>
      <td className="text-right p-[12px]">
        <div>{userDelegate.toLocaleString()}</div>
      </td>
      <td className="text-right p-[12px]">{userRewards.toLocaleString()}</td>
    </tr>
  );
}
