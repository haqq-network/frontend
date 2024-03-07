import { PropsWithChildren } from 'react';
import clsx from 'clsx';
import { formatNumber } from '../../utils/format-number';
import { Container } from '../container/container';
import { Heading } from '../heading/heading';
import { WalletIcon } from '../icons/icons';
import { MIN_REWARDS_TO_CLAIM } from '../my-account-block-desktop/my-account-block-desktop';
import { Tooltip } from '../tooltip/tooltip';

interface MyAccountBlockProps {
  balance: number;
  unbounded: number;
  totalRewards: number;
  delegated: number;
  onRewardsClaim: () => void;
  symbol: string;
  isRewardsPending?: boolean;
}

export function MyAccountCardBlock({
  title,
  children,
}: PropsWithChildren<{ title?: string }>) {
  return (
    <div className="flex flex-col items-start gap-y-[6px]">
      {title && (
        <div className="text-[10px] font-[500] uppercase leading-[12px] text-white/50 lg:text-[12px] lg:leading-[14px]">
          {title}
        </div>
      )}
      <div className="text-[16px] uppercase leading-[26px]">{children}</div>
    </div>
  );
}

export function MyAccountBlockMobile({
  onRewardsClaim,
  balance,
  unbounded,
  totalRewards,
  delegated,
  symbol,
  isRewardsPending = false,
}: MyAccountBlockProps) {
  return (
    <Container className="py-[24px] md:py-[40px]">
      <div className="flex items-center">
        <WalletIcon />
        <Heading level={3} className="mb-[-2px] ml-[8px]">
          My account
        </Heading>
      </div>

      <div className="mt-[18px] grid grid-cols-2 gap-x-[24px] gap-y-[12px] md:mt-[20px] md:grid-cols-4">
        <MyAccountCardBlock title="Available">
          {formatNumber(balance)} {symbol.toLocaleUpperCase()}
        </MyAccountCardBlock>

        <MyAccountCardBlock title="Unbonding">
          {formatNumber(unbounded)} {symbol.toLocaleUpperCase()}
        </MyAccountCardBlock>

        <MyAccountCardBlock title="Staked">
          {formatNumber(delegated)} {symbol.toLocaleUpperCase()}
        </MyAccountCardBlock>

        <MyAccountCardBlock title="Rewards">
          {formatNumber(totalRewards)} {symbol.toLocaleUpperCase()}
        </MyAccountCardBlock>
      </div>

      <div className="mt-[16px] md:mt-[12px]">
        <Tooltip
          text={
            totalRewards < MIN_REWARDS_TO_CLAIM
              ? `Minimum amount to claim rewards is ${MIN_REWARDS_TO_CLAIM} ISLM`
              : ''
          }
          className="min-w-[300px] text-center"
        >
          <button
            type="button"
            className={clsx(
              'cursor-pointer text-[14px] leading-[22px]',
              'transition-color duration-150 ease-in will-change-[color]',
              'text-[#01B26E] hover:text-[#01b26e80]',
              'disabled:cursor-not-allowed disabled:!text-[#01B26E] disabled:opacity-80',
            )}
            onClick={onRewardsClaim}
            disabled={totalRewards < MIN_REWARDS_TO_CLAIM || isRewardsPending}
          >
            Claim all rewards
          </button>
        </Tooltip>
      </div>
    </Container>
  );
}
