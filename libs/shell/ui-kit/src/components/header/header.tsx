import { ReactNode, useCallback } from 'react';
import clsx from 'clsx';
import { NavLink, useLocation } from 'react-router-dom';

export function Header({
  rightSlot,
  darkBackground = false,
  isBlurred = false,
  isHaqqWallet = false,
}: {
  rightSlot?: ReactNode;
  darkBackground?: boolean;
  isBlurred?: boolean;
  isHaqqWallet?: boolean;
}) {
  const { pathname } = useLocation();
  const renderPageTitle = useCallback(() => {
    if (pathname.startsWith('/staking')) {
      return 'Staking';
    }

    if (pathname.startsWith('/governance')) {
      return 'Governance';
    }

    if (pathname.startsWith('/authz')) {
      return 'Authz';
    }

    if (pathname.startsWith('/airdrop')) {
      return 'Airdrop';
    }

    return 'Shell';
  }, [pathname]);

  return (
    <header
      className={clsx(
        'z-50 h-[62px] w-full transform-gpu border-y border-[#464647] sm:h-[72px]',
        darkBackground ? 'bg-haqq-black' : 'bg-transparent',
        isBlurred && !darkBackground && 'backdrop-blur',
        isHaqqWallet && !darkBackground && '!bg-transparent !backdrop-blur',
      )}
    >
      <div className="mx-auto flex h-full w-full flex-row items-center pr-[16px] sm:pr-[64px] lg:pr-[80px]">
        <div
          className={clsx(
            'flex h-full w-[48px] items-center justify-center sm:w-[64px] lg:w-[80px]',
            !isHaqqWallet && 'border-r border-[#464647]',
          )}
        >
          <div className="relative h-[26px] w-[26px] sm:h-[32px] sm:w-[32px]">
            <NavLink to="/">
              <img src="/assets/logo.svg" alt="HAQQ" />
            </NavLink>
          </div>
        </div>

        <div
          className={clsx(
            'font-clash text-[24px] font-medium uppercase leading-none',
            !isHaqqWallet ? 'ml-[20px] lg:ml-[32px]' : 'ml-[8px] lg:ml-[4px]',
          )}
        >
          {!isHaqqWallet ? <NavLink to="/">HAQQ</NavLink> : renderPageTitle()}
        </div>

        <div className="flex-1" />

        {rightSlot && (
          <div className="flex flex-row items-center space-x-2">
            {rightSlot}
          </div>
        )}
      </div>
    </header>
  );
}
