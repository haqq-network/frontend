import clsx from 'clsx';
import { Button } from '@haqq/shell-ui-kit';

export function StakingInfoAmountBlock({
  title,
  value,
  symbol,
  isGreen = false,
}: {
  title: string;
  value: string;
  symbol: string;
  isGreen?: boolean;
}) {
  return (
    <div className="flex flex-row items-center justify-between sm:flex-col sm:items-start sm:justify-start sm:space-y-[6px]">
      <div className="font-sans text-[12px] font-[600] uppercase leading-[1.2em] text-white/50 sm:text-[10px] lg:text-[12px]">
        {title}
      </div>
      <div
        className={clsx(
          'font-[500] leading-[20px]',
          isGreen
            ? 'font-serif text-[16px] leading-[20px] text-[#01B26E] sm:text-[16px] sm:leading-[22px] lg:text-[20px] lg:leading-[26px]'
            : 'font-sans text-[14px] leading-[22px] text-white sm:text-[15px] sm:leading-[24px] lg:text-[18px] lg:leading-[28px]',
        )}
      >
        {value} <span>{symbol.toUpperCase()}</span>
      </div>
    </div>
  );
}

export function RewardsInfo({
  balance,
  delegated,
  rewards,
  unbounded,
  symbol,
  onRewardsClaim,
}: {
  balance: number;
  delegated: number;
  rewards: number;
  unbounded: number;
  symbol: string;
  onRewardsClaim: () => void;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-[16px] lg:flex-row lg:gap-[24px]">
      <div className="w-full flex-1">
        <div className="flex w-full flex-col gap-[8px] sm:flex-row sm:gap-[24px]">
          <div className="flex-1">
            <StakingInfoAmountBlock
              title="Available"
              value={balance.toLocaleString()}
              symbol={symbol}
            />
          </div>

          <div className="flex-1">
            <StakingInfoAmountBlock
              title="Staked"
              value={delegated.toLocaleString()}
              symbol={symbol}
            />
          </div>

          <div className="flex-1">
            <StakingInfoAmountBlock
              title="Unbounding"
              value={unbounded.toLocaleString()}
              symbol={symbol}
            />
          </div>

          <div className="flex-1">
            <StakingInfoAmountBlock
              title="Rewards"
              value={rewards.toLocaleString()}
              symbol={symbol}
              isGreen
            />
          </div>
        </div>
      </div>

      <div className="w-full text-start lg:w-auto lg:flex-none">
        <Button disabled={rewards < 1} onClick={onRewardsClaim} variant={2}>
          Claim all rewards
        </Button>
      </div>
    </div>
  );
}
