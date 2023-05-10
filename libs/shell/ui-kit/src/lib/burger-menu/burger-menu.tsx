import clsx from 'clsx';
import { ReactNode, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AccountButton } from '../account-button/account-button';
import { useAddress, useWallet } from '@haqq/shared';
import { useAccount, useBalance } from 'wagmi';
import { Button } from '@haqq/website/ui-kit';

function BurgerMenuNavLink({
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

export function BurgerMenu({ className }: { className?: string }) {
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

  return (
    <div
      className={clsx(
        'bg-[#0D0D0E] z-50 px-[20px] py-[32px] sm:py-[40px] sm:pl-[40px] sm:pr-[64px]',
        'overflow-y-auto',
        className,
      )}
    >
      <div className="flex flex-col items-start space-y-[16px] mb-[60px] sm:mb-[80px]">
        <BurgerMenuNavLink href="/staking">Staking</BurgerMenuNavLink>
        <BurgerMenuNavLink href="/governance">Governance</BurgerMenuNavLink>
      </div>
      {isConnected && (
        <AccountButton
          balance={balance}
          address={ethAddress}
          onDisconnectClick={disconnect}
          isInBurger
        />
      )}
      <Button
        className={clsx(
          'block lg:hidden !font-serif hover:text-black mt-[24px]',
        )}
        onClick={isConnected ? disconnect : openSelectWallet}
      >
        {isConnected ? 'Disconnect' : 'Connect wallet'}
      </Button>
    </div>
  );
}
