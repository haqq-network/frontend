import { PropsWithChildren } from 'react';
import { WalletIcon } from '../icons/icons';
import { Heading } from '../heading/heading';
import clsx from 'clsx';
import { Container } from '../container/container';
import { formatNumber } from '../../utils/format-number';

interface MyAccountBlockProps {
  balance: number;
  unbounded: number;
  totalRewards: number;
  delegated: number;
  onRewardsClaim: () => void;
  symbol: string;
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
        <button
          type="button"
          className={clsx(
            'transition-color cursor-pointer text-[14px] leading-[22px] text-[#01B26E] duration-150 ease-in will-change-[color] hover:text-[#01b26e80] disabled:cursor-not-allowed disabled:!text-[#01B26E] disabled:opacity-80',
          )}
          onClick={onRewardsClaim}
          disabled={totalRewards < 1}
        >
          Claim all reward
        </button>
      </div>
    </Container>
  );
}
