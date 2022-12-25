import { useMemo } from 'react';
import { formatUnits } from 'ethers/lib/utils';
import { bondStatusFromJSON } from 'cosmjs-types/cosmos/staking/v1beta1/staking';
import { ValidatorStatus } from '@haqq/staking/ui-kit';
import type { Validator } from '@evmos/provider';

export interface ValidatorListItemProps {
  validator: Validator;
  delegation?: any;
  reward?: any;
}

export function ValidatorListItem({
  validator,
  reward,
  delegation,
}: ValidatorListItemProps) {
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

  return (
    <div className="px-6 py-4 hover:bg-islamic-black-100/10 dark:hover:bg-islamic-black-500/20 border-b border-islamic-black-100/20 cursor-pointer transition-[background] duration-75">
      <div className="flex items-center justify-between space-x-6">
        <div className="w-1/3">
          <div>{validator.description?.moniker}</div>
        </div>

        <div className="w-[100px] text-center">
          <ValidatorStatus
            jailed={validator.jailed}
            status={bondStatusFromJSON(validator.status)}
          />
        </div>
        <div className="w-[50px] text-center">{validatorCommission}%</div>
        <div className="flex-1 text-right">
          <span className="font-semibold">{votingPower.toLocaleString()}</span>{' '}
        </div>
        <div className="flex-1 text-right">{userDelegate.toLocaleString()}</div>
        <div className="flex-1 text-right">{userRewards.toLocaleString()}</div>
      </div>
    </div>
  );
}
