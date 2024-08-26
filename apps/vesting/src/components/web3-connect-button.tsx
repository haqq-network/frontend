import { PropsWithChildren, ReactNode } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import clsx from 'clsx';
import { formatUnits } from 'viem';
import { useAccount, useBalance } from 'wagmi';
import { getFormattedAddress, useWallet } from '@haqq/shell-shared';
import { Button } from './Button/Button';
import { NetworkButton } from './network-status';

function formatNumber(
  numberToFormat: number,
  minimumFractionDigits = 0,
  maximumFractionDigits = 3,
  locale = 'en-US',
) {
  return numberToFormat.toLocaleString(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  });
}

function AddressButton({
  children,
  onClick,
  className,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const classNames = clsx(
    'h-[36px] px-[8px] py-[6px] appearance-none outline-none',
    'rounded-[6px] font-sans',
    'flex flex-row space-x-[8px] justify-center items-center',
    'bg-white hover:bg-white/90',
    'transition-colors duration-150 ease-linear',
    className,
  );

  return (
    <button className={classNames} onClick={onClick}>
      {children}
    </button>
  );
}

function BalanceButton({
  children,
  onClick,
  className,
}: PropsWithChildren<{
  className?: string;
  onClick?: () => void;
}>) {
  const classNames = clsx(
    'font-messiri text-base leading-[24px]',
    'px-[12px] py-[8px] rounded-none',
    'text-white bg-primary hover:bg-[#20d775]',
    'transition-colors duration-150 ease-linear',
    'rounded-l-[8px]',
    className,
  );

  return (
    <button className={classNames} onClick={onClick}>
      {children}
    </button>
  );
}

function AccountButton() {
  const { address } = useAccount();
  const { disconnect } = useWallet();
  const { data: balance } = useBalance({ address });

  return (
    <div className="bg-primary flex flex-row rounded-[8px]">
      {balance && (
        <BalanceButton className="hidden sm:block">
          <div className="mb-[-3px] font-bold">
            {formatNumber(
              Number.parseFloat(formatUnits(BigInt(balance?.value), 18)),
            )}
            &nbsp;ISLM
          </div>
        </BalanceButton>
      )}

      <Menu as="div" className="relative inline-block text-left">
        <MenuButton as="div" className="bg-primary rounded-[8px] p-[2px]">
          <AddressButton>
            <div className="flex-1 text-[14px] font-medium">
              {getFormattedAddress(address, 3, 2)}
            </div>
          </AddressButton>
        </MenuButton>

        <MenuItems className="absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-white py-1 shadow-lg focus:outline-none">
          <MenuItem
            as="button"
            className="hover:bg-light-green hover:text-primary block w-full px-[16px] py-[6px] text-left leading-[24px] transition-colors duration-150 ease-out"
            onClick={disconnect}
          >
            Disconnect
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  );
}

export default function ConnectButton() {
  const { isConnected } = useAccount();
  const { openSelectWallet } = useWallet();

  if (!isConnected) {
    return <Button onClick={openSelectWallet}>Connect Wallet</Button>;
  }

  return (
    <>
      <NetworkButton />
      <AccountButton />
    </>
  );
}
