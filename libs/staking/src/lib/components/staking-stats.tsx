import clsx from 'clsx';
import { Button, Tooltip } from '@haqq/shell-ui-kit';
import {
  Container,
  Heading,
  MIN_REWARDS_TO_CLAIM,
  WalletIcon,
} from '@haqq/shell-ui-kit/server';

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
  uppercaseSymbol = true,
}: {
  title: string;
  value: string;
  symbol: string;
  isGreen?: boolean;
  uppercaseSymbol?: boolean;
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
        {value} <span>{uppercaseSymbol ? symbol.toUpperCase() : symbol}</span>
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
          Regular staking
        </Heading>
      </div>

      <div className="flex w-full flex-col items-center gap-[16px] lg:flex-row lg:gap-[24px]">
        <div className="flex w-full flex-1 flex-row gap-[24px]">
          <div className="flex flex-row gap-[24px]">
            <div className="w-[210px]">
              <StakingStatsDesktopAmountBlock
                title="Available"
                value={balance}
                symbol={symbol}
              />
            </div>

            <div className="w-[210px]">
              <StakingStatsDesktopAmountBlock
                title="Staked"
                value={delegated}
                symbol={symbol}
              />
            </div>

            <div className="w-[210px]">
              <StakingStatsDesktopAmountBlock
                title="Unbonding"
                value={unbounded}
                symbol={symbol}
              />
            </div>

            <div className="w-[210px]">
              <StakingStatsDesktopAmountBlock
                title="Rewards"
                value={rewards}
                symbol={symbol}
                isGreen
              />
            </div>
          </div>

          <div className="w-full text-start lg:w-auto lg:flex-none">
            <Tooltip
              text={
                Number.parseFloat(rewards) < MIN_REWARDS_TO_CLAIM
                  ? `Minimum amount to claim rewards is ${MIN_REWARDS_TO_CLAIM} ISLM`
                  : ''
              }
            >
              <Button
                disabled={Number.parseFloat(rewards) < MIN_REWARDS_TO_CLAIM}
                onClick={onRewardsClaim}
                variant={2}
                isLoading={isRewardsPending}
              >
                Claim all rewards
              </Button>
            </Tooltip>
          </div>
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
  uppercaseSymbol = true,
}: {
  title: string;
  value: string;
  symbol: string;
  isGreen?: boolean;
  uppercaseSymbol?: boolean;
}) {
  return (
    <div className="flex flex-row items-center justify-between gap-y-[6px]">
      <div>
        <div className="font-guise text-[12px] font-[600] uppercase leading-[20px] text-white/50">
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
          {value}&nbsp;
          {uppercaseSymbol ? symbol.toUpperCase() : symbol}
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
    <div className="flex flex-col items-start gap-[16px] overflow-x-auto px-[16px] py-[20px] sm:gap-[32px] sm:px-[48px] sm:py-[32px]">
      <div className="flex flex-row items-center">
        <WalletIcon />
        <Heading level={3} className="mb-[-2px] ml-[8px]">
          Regular staking
        </Heading>
      </div>

      <div className="mt-[8px] flex w-full flex-1 flex-col gap-[8px]">
        <StakingStatsMobileAmountBlock
          title="Available"
          value={balance}
          symbol={symbol}
        />
        <StakingStatsMobileAmountBlock
          title="Staked"
          value={delegated}
          symbol={symbol}
        />
        <StakingStatsMobileAmountBlock
          title="Unbonding"
          value={unbounded}
          symbol={symbol}
        />
        <StakingStatsMobileAmountBlock
          title="Rewards"
          value={rewards}
          symbol={symbol}
          isGreen
        />
      </div>

      <div>
        <Tooltip
          text={
            Number.parseFloat(rewards) < MIN_REWARDS_TO_CLAIM
              ? `Minimum amount to claim rewards is ${MIN_REWARDS_TO_CLAIM} ISLM`
              : ''
          }
        >
          <Button
            onClick={onRewardsClaim}
            className="w-full px-[32px]"
            variant={2}
            isLoading={isRewardsPending}
            disabled={Number.parseFloat(rewards) < MIN_REWARDS_TO_CLAIM}
            data-attr="get-rewards"
          >
            Get rewards
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}
