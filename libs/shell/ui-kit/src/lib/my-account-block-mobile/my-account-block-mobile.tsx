import { PropsWithChildren, useState } from 'react';
import { WalletIcon } from '../icons/icons';
import { Heading } from '../heading/heading';
import clsx from 'clsx';

interface MyAccountBlockProps {
  balance: number;
  unbounded: number;
  totalRewards: number;
  delegated: number;
  onRewardsClaim: () => void;
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
}: MyAccountBlockProps) {
  const [isInfoShown, setInfoShown] = useState(false);

  return (
    <div className="border-haqq-border overflow-hidden rounded-[8px] border">
      <div className="flex flex-col gap-[24px] px-[28px] py-[32px]">
        <div className="flex flex-row items-center">
          <WalletIcon />
          <Heading level={3} className="ml-[8px]">
            My account
          </Heading>
          <button
            className={clsx(
              'text-[14px] font-[600] leading-[20px] text-[#EC5728] hover:text-[#FF8D69]',
              'mt-[-4px] inline-flex cursor-pointer flex-row items-center justify-center gap-[4px] transition-colors duration-100 ease-out',
              'ml-[16px]',
            )}
            onClick={() => {
              setInfoShown(!isInfoShown);
            }}
          >
            <div>{isInfoShown ? 'Hide Info' : 'Show Info'}</div>
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={clsx('mb-[-4px]', isInfoShown && 'rotate-180')}
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.85205 12.8333L6.14841 14.1296L11.0002 9.27782L15.8521 14.1296L17.1484 12.8333L11.0002 6.68509L4.85205 12.8333Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        {isInfoShown && (
          <div className="flex flex-col gap-[16px]">
            <div className="grid grid-cols-2 gap-x-[24px] gap-y-[16px]">
              <div>
                <MyAccountCardBlock title="Available">
                  {Math.round(balance)} ISLM
                </MyAccountCardBlock>
              </div>
              <div>
                <MyAccountCardBlock title="Unbounded">
                  {unbounded.toLocaleString()} ISLM
                </MyAccountCardBlock>
              </div>
              <div>
                <MyAccountCardBlock title="Staked">
                  {delegated.toLocaleString()} ISLM
                </MyAccountCardBlock>
              </div>
              <div>
                <MyAccountCardBlock title="Rewards">
                  {totalRewards.toLocaleString()} ISLM
                </MyAccountCardBlock>
              </div>
            </div>
            <div>
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
          </div>
        )}
      </div>
    </div>
  );
}

export function MyAccountBlockMobileNew({
  onRewardsClaim,
  balance,
  unbounded,
  totalRewards,
  delegated,
}: MyAccountBlockProps) {
  return (
    <div className="bg-[#252528] px-[16px] py-[24px] md:px-[48px] md:py-[40px] lg:hidden">
      <div className="flex items-center">
        <WalletIcon />
        <Heading level={3} className="ml-[8px]">
          My account
        </Heading>
      </div>
      <div className="mt-[16px] grid grid-cols-2 gap-x-[24px] gap-y-[12px] md:mt-[20px] md:grid-cols-4">
        <MyAccountCardBlock title="Available">
          {Math.round(balance)} ISLM
        </MyAccountCardBlock>

        <MyAccountCardBlock title="Unbounded">
          {unbounded.toLocaleString()} ISLM
        </MyAccountCardBlock>

        <MyAccountCardBlock title="Staked">
          {delegated.toLocaleString()} ISLM
        </MyAccountCardBlock>

        <MyAccountCardBlock title="Rewards">
          {totalRewards.toLocaleString()} ISLM
        </MyAccountCardBlock>
      </div>
      <button
        type="button"
        className={clsx(
          'transition-color mt-[12px] cursor-pointer text-[14px] leading-[22px] text-[#01B26E] duration-150 ease-in will-change-[color] hover:text-[#01b26e80] disabled:cursor-not-allowed disabled:!text-[#01B26E] disabled:opacity-80 md:mt-[16px]',
        )}
        onClick={onRewardsClaim}
        disabled={totalRewards < 1}
      >
        Claim all reward
      </button>
    </div>
  );
}
