import { useMemo } from 'react';
import { formatUnits } from 'ethers/lib/utils';
import { bondStatusFromJSON } from 'cosmjs-types/cosmos/staking/v1beta1/staking';
import type { Validator, DelegationResponse, Reward } from '@evmos/provider';
import { ValidatorListStatus } from '../validator-status/validator-status';
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
      className="cursor-pointer border-t border-[#FFFFFF26] text-[11px] leading-[18px] transition-[background] duration-75 hover:bg-white hover:bg-opacity-[2.5%] md:text-[16px] md:leading-[26px]"
      onClick={() => {
        // console.log(`validator/${validator.operator_address}`);
        navigate(`validator/${validator.operator_address}`);
      }}
    >
      <td className="p-[8px] md:p-[12px]">
        <div className="w-full overflow-hidden">
          <p className="overflow-ellipsis">{validator.description?.moniker}</p>
        </div>
      </td>
      <td className="p-[8px] text-left md:p-[12px]">
        <ValidatorListStatus
          jailed={validator.jailed}
          status={bondStatusFromJSON(validator.status)}
          className="!text-[11px] !leading-[18px] md:!text-[16px] md:!leading-[26px]"
        />
      </td>
      <td className="max-w-[80px] p-[8px] text-left md:p-[12px]">
        {validatorCommission}%
      </td>
      <td className="p-[8px] text-right md:p-[12px]">
        {votingPower.toLocaleString()}
      </td>
      <td className="p-[8px] text-right md:p-[12px]">
        {votingPowerInPercents}%
      </td>
      <td className="p-[8px] text-right md:p-[12px]">
        {userDelegate.toLocaleString()}
      </td>
      <td className="p-[8px] text-right md:p-[12px]">
        {userRewards.toLocaleString()}
      </td>
    </tr>
  );
}
