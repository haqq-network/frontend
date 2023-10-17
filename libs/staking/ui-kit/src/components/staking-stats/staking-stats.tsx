import clsx from 'clsx';
import { Button, Container, Heading, WalletIcon } from '@haqq/shell-ui-kit';

interface StakingStatsProps {
  balance: string;
  delegated: string;
  rewards: string;
  unbounded: string;
  symbol: string;
  onRewardsClaim: () => void;
  isRewardsPending?: boolean;
}

export function StakingStatsDesktopAmountBlock({
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
      <div className="font-guise text-[12px] font-[600] uppercase leading-[1.2em] text-white/50 sm:text-[10px] lg:text-[12px]">
        {title}
      </div>
      <div
        className={clsx(
          'font-[500] leading-[20px]',
          isGreen
            ? 'font-clash text-[16px] leading-[20px] text-[#01B26E] sm:text-[16px] sm:leading-[22px] lg:text-[20px] lg:leading-[26px]'
            : 'font-guise text-[14px] leading-[22px] text-white sm:text-[15px] sm:leading-[24px] lg:text-[18px] lg:leading-[28px]',
        )}
      >
        {value} <span>{symbol.toUpperCase()}</span>
      </div>
    </div>
  );
}

export function StakingStatsDesktop({
  balance,
  delegated,
  rewards,
  unbounded,
  symbol,
  onRewardsClaim,
  isRewardsPending = false,
}: StakingStatsProps) {
  return (
    <Container className="flex min-h-[100px] flex-col justify-center gap-[24px]">
      <div className="flex flex-row items-center">
        <WalletIcon />
        <Heading level={3} className="mb-[-2px] ml-[8px]">
          My account
        </Heading>
      </div>
      <div className="flex w-full flex-col items-center gap-[16px] lg:flex-row lg:gap-[24px]">
        <div className="w-full flex-1">
          <div className="flex w-full flex-col gap-[8px] sm:flex-row sm:gap-[24px]">
            <div className="flex-1">
              <StakingStatsDesktopAmountBlock
                title="Available"
                value={balance}
                symbol={symbol}
              />
            </div>

            <div className="flex-1">
              <StakingStatsDesktopAmountBlock
                title="Staked"
                value={delegated}
                symbol={symbol}
              />
            </div>

            <div className="flex-1">
              <StakingStatsDesktopAmountBlock
                title="Unbonding"
                value={unbounded}
                symbol={symbol}
              />
            </div>

            <div className="flex-1">
              <StakingStatsDesktopAmountBlock
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
            isLoading={isRewardsPending}
          >
            Claim all rewards
          </Button>
        </div>
      </div>
    </Container>
  );
}

export function StakingStatsMobileAmountBlock({
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
  isRewardsPending = false,
}: StakingStatsProps) {
  return (
    <div className="flex flex-row items-start gap-[16px] overflow-x-auto px-[16px] py-[20px] sm:gap-[32px] sm:px-[48px] sm:py-[32px]">
      <div>
        <WalletIcon />
      </div>
      <div className="flex-initial">
        <StakingStatsMobileAmountBlock
          title="Available"
          value={balance}
          symbol={symbol}
        />
      </div>
      <div className="flex-initial">
        <StakingStatsMobileAmountBlock
          title="Staked"
          value={delegated}
          symbol={symbol}
        />
      </div>
      <div className="flex-initial">
        <StakingStatsMobileAmountBlock
          title="Unbonding"
          value={unbounded}
          symbol={symbol}
        />
      </div>
      <div className="flex-initial">
        <StakingStatsMobileAmountBlock
          title="Rewards"
          value={rewards}
          symbol={symbol}
          isGreen
        />
      </div>
      <div className="flex-none">
        <Button
          onClick={onRewardsClaim}
          className="px-[32px]"
          variant={2}
          isLoading={isRewardsPending}
        >
          Get rewards
        </Button>
      </div>
    </div>
  );
}
