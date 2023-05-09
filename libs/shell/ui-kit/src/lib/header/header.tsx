import {
  Fragment,
  ReactElement,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import clsx from 'clsx';
import ScrollLock from 'react-scrolllock';
import { useAccount, useBalance } from 'wagmi';
import { Link } from 'react-router-dom';
import { AccountButton } from '../account-button/account-buttonx';
import { BurgerMenu } from '../burger-menu/burger-menux';
import { HaqqLogo } from '../haqq-logo/haqq-logox';
import { getFormattedAddress, useAddress, useMetamask } from '@haqq/shared';
import { Button, BurgerButton } from '@haqq/website/ui-kit';

function HeaderNavLink({
  href,
  children,
  isOutLink = false,
}: {
  href: string;
  children: ReactNode;
  isOutLink?: boolean;
}) {
  const additionalProps = isOutLink
    ? {
        target: '_blank',
        rel: 'noopener noreferrer',
      }
    : {};
  return (
    <Link
      to={href}
      className="text-[13px] leading-[20px] sm:text-[15px] sm:leading-[24px]"
      {...additionalProps}
    >
      {children}
    </Link>
  );
}

const BurgerMenuBalanceButton = ({
  balance,
  address,
}: {
  balance?: {
    symbol: string;
    value: number;
  };
  address: string | undefined;
}): ReactElement => {
  return (
    <div className="flex flex-row rounded-[6px] max-w-fit outline outline-white">
      {balance && (
        <div className="font-clash tracking-[.01em] leading-[24px] pl-[12px] py-[8px] pr-[8px]">
          {`${balance.value.toLocaleString()} ${balance.symbol.toLocaleUpperCase()}`}
        </div>
      )}
      <div className="">
        <button
          className={clsx(
            'flex flex-row items-center space-x-2 rounded-[6px] px-3 py-[9px]',
            'cursor-pointer bg-white hover:bg-white/80 active:bg-white text-black',
            'transition-all duration-150 ease-in',
            'box-border appearance-none outline-none',
          )}
        >
          <div className="text-sm leading-[24px]">
            {getFormattedAddress(address, 3, 2)}
          </div>
        </button>
      </div>
    </div>
  );
};

export function Header() {
  const { connect, disconnect } = useMetamask();
  const { ethAddress } = useAddress();
  const { isConnected } = useAccount();
  const { data: balanceData } = useBalance({
    address: ethAddress,
    watch: true,
  });
  const balance = useMemo(() => {
    if (!balanceData) {
      return undefined;
    }

    return {
      symbol: balanceData.symbol,
      value: Number.parseFloat(balanceData.formatted),
    };
  }, [balanceData]);
  const [isBurgerMenuOpen, setBurgerMenuOpen] = useState(false);

  const handleMenuOpen = useCallback(() => {
    setBurgerMenuOpen((isBurgerMenuOpen: boolean) => {
      return !isBurgerMenuOpen;
    });
  }, []);

  return (
    <header
      className={clsx(
        'border-t border-b border-[#464647] w-full h-[63px] sm:h-[72px] bg-haqq-black',
        'backdrop-blur transform-gpu',
        'top-0 sticky z-50',
      )}
    >
      <div className="w-full flex flex-row items-center h-full pr-[16px] sm:pr-[64px] lg:pr-[80px] mx-auto">
        <div className="w-[48px] sm:w-[64px] lg:w-[80px] h-full flex items-center justify-center border-r border-[#464647]">
          <HeaderNavLink href="/">
            <div className="relative w-[26px] h-[26px] sm:w-[32px] sm:h-[32px] flex items-center">
              <HaqqLogo />
            </div>
          </HeaderNavLink>
        </div>
        <div className="ml-[12px] sm:ml-[20px] lg:ml-[32px] font-clash text-[20px] sm:text-[24px] leading-none">
          HAQQ
        </div>
        <div className="flex-1" />
        <nav className="flex-row space-x-6 items-center mr-[80px] hidden lg:flex font-guise">
          <HeaderNavLink href="/staking">Staking</HeaderNavLink>
          <HeaderNavLink href="/governance">Governance</HeaderNavLink>
        </nav>
        <div className="flex flex-row items-center">
          {isConnected ? (
            <AccountButton
              balance={balance}
              address={ethAddress}
              onDisconnectClick={disconnect}
              className="hidden"
            />
          ) : (
            <Button
              className={clsx('hidden lg:block !font-clash hover:text-black')}
              onClick={connect}
            >
              Connect wallet
            </Button>
          )}
          <BurgerButton
            className="ml-[24px] block lg:hidden"
            isOpen={isBurgerMenuOpen}
            onClick={handleMenuOpen}
          />
        </div>
      </div>

      {isBurgerMenuOpen && (
        <Fragment>
          <ScrollLock isActive />

          <BurgerMenu
            connectButton={
              isConnected && (
                <BurgerMenuBalanceButton
                  balance={balance}
                  address={ethAddress}
                />
              )
            }
            disconnectButton={
              <Button
                className="!font-clash hover:text-black"
                onClick={isConnected ? disconnect : connect}
              >
                {isConnected ? 'Disconnect' : 'Connect wallet'}
              </Button>
            }
            className="fixed lg:hidden w-full top-[62px] sm:top-[71px] h-[calc(100vh-62px)] sm:h-[calc(100vh-71px)] right-0 z-40"
          />
          <div
            onClick={handleMenuOpen}
            className="hidden sm:block lg:hidden absolute w-full right-0 -z-0 bg-black/50 top-[62px] sm:top-[71px] h-[calc(100vh-62px)] sm:h-[calc(100vh-71px)]"
          />
        </Fragment>
      )}
    </header>
  );
}
