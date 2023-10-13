import clsx from 'clsx';
import { Button, WalletIcon } from '@haqq/shell-ui-kit';

interface StakingStatsMobileProps {
  balance: string;
  delegated: string;
  rewards: string;
  unbounded: string;
  symbol: string;
  onRewardsClaim: () => void;
}

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

export function StakingStats({
  balance,
  delegated,
  rewards,
  unbounded,
  symbol,
  onRewardsClaim,
}: {
  balance: string;
  delegated: string;
  rewards: string;
  unbounded: string;
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
              value={balance}
              symbol={symbol}
            />
          </div>

          <div className="flex-1">
            <StakingInfoAmountBlock
              title="Staked"
              value={delegated}
              symbol={symbol}
            />
          </div>

          <div className="flex-1">
            <StakingInfoAmountBlock
              title="Unbonding"
              value={unbounded}
              symbol={symbol}
            />
          </div>

          <div className="flex-1">
            <StakingInfoAmountBlock
              title="Rewards"
              value={rewards}
              symbol={symbol}
              isGreen
            />
          </div>
        </div>
      </div>

      <div className="w-full text-start lg:w-auto lg:flex-none">
        <Button
          disabled={Number.parseFloat(rewards) < 1}
          onClick={onRewardsClaim}
          variant={2}
        >
          Claim all rewards
        </Button>
      </div>
    </div>
  );
}

export function StakingInfoAmountBlockMobile({
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
    <div className="flex flex-col items-start gap-y-[6px]">
      <div>
        <div className="font-guise text-[12px] font-[600] uppercase leading-[1.2em] text-white/50">
          {title}
        </div>
      </div>
      <div>
        <div
          className={clsx(
            'font-guise text-[13px] font-[500] leading-[20px]',
            isGreen ? 'text-[#01B26E]' : 'text-white',
          )}
        >
          {value}&nbsp;{symbol.toUpperCase()}
        </div>
      </div>
    </div>
  );
}

export function StakingStatsMobile({
  balance,
  delegated,
  onRewardsClaim,
  rewards,
  symbol,
  unbounded,
}: StakingStatsMobileProps) {
  return (
    <div className="flex flex-row items-start gap-[16px] overflow-x-auto px-[16px] py-[20px]">
      <div>
        <WalletIcon />
      </div>
      <div className="flex-initial">
        <StakingInfoAmountBlockMobile
          title="Available"
          value={balance}
          symbol={symbol}
        />
      </div>
      <div className="flex-initial">
        <StakingInfoAmountBlockMobile
          title="Staked"
          value={delegated}
          symbol={symbol}
        />
      </div>
      <div className="flex-initial">
        <StakingInfoAmountBlockMobile
          title="Unbonding"
          value={unbounded}
          symbol={symbol}
        />
      </div>
      <div className="flex-initial">
        <StakingInfoAmountBlockMobile
          title="Rewards"
          value={rewards}
          symbol={symbol}
          isGreen
        />
      </div>
      <div className="min-w-[170px]">
        <Button onClick={onRewardsClaim} variant={2}>
          Get rewards
        </Button>
      </div>
    </div>
  );
}
