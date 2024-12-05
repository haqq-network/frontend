import { useMemo } from 'react';
import clsx from 'clsx';
import { formatUnits } from 'viem';
import {
  useIndexerBalanceQuery,
  useStakingUnbondingsQuery,
} from '@haqq/shell-shared';
import { useStislmBalance } from '@haqq/shell-staking';
import {
  formatNumber,
  CoinIcon,
  LockIcon,
  StakedVestedBalance,
} from '@haqq/shell-ui-kit/server';

const useUnbonding = (haqqAddress: string) => {
  const { data: undelegations } = useStakingUnbondingsQuery(haqqAddress);
  const unbonding = useMemo(() => {
    const allUnbound: number[] = (undelegations ?? []).map((validator) => {
      let sum = 0;

      validator.entries.forEach((unbondingValue) => {
        sum += Number.parseFloat(unbondingValue.balance);
      });

      return sum;
    });

    const result = allUnbound.reduce<number>((accumulator, current) => {
      return accumulator + current;
    }, 0);

    return Number.parseFloat(formatUnits(BigInt(result), 18));
  }, [undelegations]);

  return unbonding;
};

export function StakingBalanceBlock({
  haqqAddress,

  className,
}: {
  haqqAddress: string;
  className?: string;
}) {
  const { data: balances } = useIndexerBalanceQuery(haqqAddress);
  const unbonding = useUnbonding(haqqAddress);

  const stIslmBalance = useStislmBalance();

  if (!balances) {
    return null;
  }

  return (
    <div
      className={clsx(
        'bg-haqq-black font-guise border-haqq-border max-w-[320px] transform-gpu rounded-lg border bg-opacity-90 px-[8px] text-white shadow-lg backdrop-blur',
        className,
      )}
    >
      <div className="flex flex-col divide-y divide-white/15">
        <div className="py-[8px]">
          <p className="text-[12px] leading-[18px] text-[#8E8E8E]">
            Locked tokens are your tokens but you cannot transfer to other users
            or use them to pay for gas, but you can delegate to validators -
            stake to improve the reliability of the HAQQ network, and make a
            profit. Locked tokens are unlocked according to the schedule.
          </p>
        </div>

        <div className="py-[8px]">
          <div className="flex flex-row items-center gap-[4px]">
            <CoinIcon />
            <div className="text-[12px] leading-[18px] text-white lg:text-[14px] lg:leading-[22px]">
              Available: {formatNumber(balances.availableForStake)}
            </div>
          </div>
        </div>
        <div className="py-[8px]">
          <div className="flex flex-col gap-[8px]">
            <div className="flex flex-row items-center gap-[4px]">
              <LockIcon />
              <div className="text-[12px] leading-[18px] text-white lg:text-[14px] lg:leading-[22px]">
                Locked: {formatNumber(stIslmBalance + balances.locked)}
              </div>
            </div>

            <div>
              <StakedVestedBalance
                staked={balances.staked}
                liquidStaked={stIslmBalance}
                vested={balances.vested}
                daoLocked={balances.daoLocked}
                unbonding={unbonding}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
