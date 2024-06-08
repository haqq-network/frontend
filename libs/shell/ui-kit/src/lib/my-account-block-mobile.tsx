import clsx from 'clsx';
import { Container } from './container';
import { Heading } from './heading';
import { WalletIcon } from './icons';
import { MyAccountCardBlock } from './my-account-card-block';
import { Tooltip } from './tooltip';
import { formatNumber } from '../utils/format-number';

interface MyAccountBlockProps {
  balance: number;
  unbounded: number;
  totalRewards: number;
  delegated: number;
  onRewardsClaim: () => void;
  symbol: string;
  isRewardsPending?: boolean;
  minRewardsToClaim?: number;
}

export function MyAccountBlockMobile({
  onRewardsClaim,
  balance,
  unbounded,
  totalRewards,
  delegated,
  symbol,
  isRewardsPending = false,
  minRewardsToClaim = 1,
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
            totalRewards < minRewardsToClaim
              ? `Minimum amount to claim rewards is ${minRewardsToClaim} ISLM`
              : ''
          }
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
            disabled={totalRewards < minRewardsToClaim || isRewardsPending}
          >
            Claim all rewards
          </button>
        </Tooltip>
      </div>
    </Container>
  );
}
