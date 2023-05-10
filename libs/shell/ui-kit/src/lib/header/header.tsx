import {
  Fragment,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import clsx from 'clsx';
import logoImageData from '../../assets/images/logo.svg';
import { BurgerButton, Button } from '@haqq/website/ui-kit';
import ScrollLock from 'react-scrolllock';
import { BurgerMenu } from '../burger-menu/burger-menu';
import { Link } from 'react-router-dom';
import {
  SelectWalletModal,
  useAddress,
  useMetamask,
  useWallet,
} from '@haqq/shared';
import { useAccount, useBalance } from 'wagmi';
import { AccountButton } from '../account-button/account-button';

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
      className="font-sans text-[13px] leading-[20px] sm:text-[15px] sm:leading-[24px]"
      {...additionalProps}
    >
      {children}
    </Link>
  );
}

export function Header() {
  const [isBurgerMenuOpen, setBurgerMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  // const { connect, disconnect } = useMetamask();
  const { ethAddress } = useAddress();
  const { isConnected } = useAccount();
  const { data: balanceData } = useBalance({
    address: ethAddress,
    watch: true,
  });
  const {
    disconnect,
    openSelectWallet,
    isSelectWalletOpen,
    closeSelectWallet,
  } = useWallet();

  const balance = useMemo(() => {
    if (!balanceData) {
      return undefined;
    }

    return {
      symbol: balanceData.symbol,
      value: Number.parseFloat(balanceData.formatted),
    };
  }, [balanceData]);

  const handleMenuOpen = useCallback(() => {
    setBurgerMenuOpen((isBurgerMenuOpen: boolean) => {
      return !isBurgerMenuOpen;
    });
  }, []);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 1024);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header
      className={clsx(
        'border-t border-b border-[#464647] w-full h-[63px] sm:h-[72px]',
        'backdrop-blur transform-gpu',
        'top-0 sticky z-50',
        isBurgerMenuOpen && isMobile ? 'bg-[#0D0D0E]' : 'bg-transparent',
      )}
    >
      <div className="w-full flex flex-row items-center h-full pr-[16px] sm:pr-[64px] lg:pr-[80px] mx-auto">
        <div className="w-[48px] sm:w-[64px] lg:w-[80px] h-full flex items-center justify-center border-r border-[#464647]">
          <div className="relative w-[26px] h-[26px] sm:w-[32px] sm:h-[32px]">
            <img src={logoImageData} alt="HAQQ" />
          </div>
        </div>
        <div className="font-serif ml-[20px] lg:ml-[32px] font-medium text-[24px] leading-none">
          <Link to="/">HAQQ</Link>
        </div>
        <div className="flex-1" />
        <nav className="flex-row space-x-6 items-center mr-[80px] hidden lg:flex">
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
              className={clsx('hidden lg:block !font-serif hover:text-black')}
              onClick={openSelectWallet}
            >
              Connect wallet
            </Button>
          )}
          <BurgerButton
            className="ml-[24px] block lg:hidden"
            isOpen={isBurgerMenuOpen}
            onClick={handleMenuOpen}
          />
          <SelectWalletModal
            isOpen={isSelectWalletOpen}
            onClose={closeSelectWallet}
            className="text-haqq-black"
          />
        </div>
      </div>

      {isBurgerMenuOpen && (
        <Fragment>
          <ScrollLock isActive />
          <BurgerMenu className="fixed lg:hidden w-full top-[62px] sm:top-[71px] h-[calc(100vh-62px)] sm:h-[calc(100vh-71px)] right-0 z-40" />
          <div
            onClick={handleMenuOpen}
            className="hidden sm:block lg:hidden absolute w-full right-0 -z-0 bg-black/50 top-[62px] sm:top-[71px] h-[calc(100vh-62px)] sm:h-[calc(100vh-71px)]"
          />
        </Fragment>
      )}
    </header>
  );
}
