import { useState } from 'react';
import clsx from 'clsx';
import { formatNumber } from '../../utils/format-number';
import { Button } from '../button/button';
import { Heading } from '../heading/heading';
import { WalletIcon } from '../icons/icons';
import { MyAccountCardBlock } from '../my-account-block-mobile/my-account-block-mobile';

export function MyAccountBlockDesktop({
  onRewardsClaim,
  balance,
  unbounded,
  totalRewards,
  delegated,
  symbol,
  isConnected,
  onConnectWalletClick,
  isRewardsPending = false,
}: {
  onRewardsClaim: () => void;
  balance: number;
  unbounded: number;
  totalRewards: number;
  delegated: number;
  symbol: string;
  isConnected?: boolean;
  onConnectWalletClick: () => void;
  isRewardsPending?: boolean;
}) {
  const [isInfoShown, setInfoShown] = useState(false);

  return (
    <div className="border-haqq-border overflow-hidden rounded-[8px] border">
      <div className="flex flex-col gap-[24px] px-[28px] py-[32px]">
        <div className="flex flex-row items-center">
          <WalletIcon />
          <Heading level={3} className="mb-[-2px] ml-[8px]">
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
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={clsx(
                'mb-[-4px] h-[20px] w-[20px]',
                !isInfoShown && 'rotate-180',
              )}
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
          <div>
            {!isConnected ? (
              <div className="py-[24px] md:py-[40px]">
                <div className="flex flex-col items-center gap-[12px]">
                  <div className="font-sans text-[14px] leading-[22px] md:text-[18px] md:leading-[28px]">
                    You should connect wallet first
                  </div>
                  <Button
                    onClick={onConnectWalletClick}
                    variant={2}
                    className="text-black hover:bg-transparent hover:text-white"
                  >
                    Connect wallet
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-[16px]">
                <div className="grid grid-cols-2 gap-x-[24px] gap-y-[16px]">
                  <div>
                    <MyAccountCardBlock title="Available">
                      {formatNumber(balance)} {symbol.toLocaleUpperCase()}
                    </MyAccountCardBlock>
                  </div>
                  <div>
                    <MyAccountCardBlock title="Unbonding">
                      {formatNumber(unbounded)} {symbol.toLocaleUpperCase()}
                    </MyAccountCardBlock>
                  </div>
                  <div>
                    <MyAccountCardBlock title="Staked">
                      {formatNumber(delegated)} {symbol.toLocaleUpperCase()}
                    </MyAccountCardBlock>
                  </div>
                  <div>
                    <MyAccountCardBlock title="Rewards">
                      {formatNumber(totalRewards)} {symbol.toLocaleUpperCase()}
                    </MyAccountCardBlock>
                  </div>
                </div>
                <div>
                  <button
                    className={clsx(
                      'transition-color cursor-pointer text-[14px] leading-[22px] text-[#01B26E] duration-150 ease-in will-change-[color] hover:text-[#01b26e80] disabled:cursor-not-allowed disabled:!text-[#01B26E] disabled:opacity-80',
                    )}
                    onClick={onRewardsClaim}
                    disabled={totalRewards < 1 || isRewardsPending}
                  >
                    Claim all rewards
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
