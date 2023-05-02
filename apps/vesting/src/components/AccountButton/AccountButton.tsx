// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { Fragment, ReactElement, ReactNode } from 'react';
import clsx from 'clsx';
import { Button } from '../Button/Button';
import { IdentIcon } from '../IdentIcon/IdentIcon';
import { Menu, Transition } from '@headlessui/react';
import { getFormattedAddress } from '@haqq/shared';

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
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const classNames = clsx(
    'font-serif text-base leading-[24px]',
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

export interface AccountButtonProps {
  account?: {
    address: string;
    balance?: {
      value: number;
      symbol: string;
    };
  };
  onConnectClick?: () => void;
  onDisconnectClick?: () => void;
  onAddressClick?: () => void;
  onBalanceClick?: () => void;
}

export function AccountButton({
  account,
  onConnectClick,
  onDisconnectClick,
  // onAddressClick,
  onBalanceClick,
}: AccountButtonProps): ReactElement {
  if (!account) {
    return <Button onClick={onConnectClick}>Connect Wallet</Button>;
  }

  return (
    <div className="flex flex-row bg-primary rounded-[8px]">
      {account.balance && (
        <BalanceButton onClick={onBalanceClick} className="hidden sm:block">
          <div className="mb-[-4px] font-bold">
            {account.balance.value.toLocaleString()}{' '}
            {account.balance.symbol.toLocaleUpperCase()}
          </div>
        </BalanceButton>
      )}

      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button as="div" className="rounded-[8px] bg-primary p-[2px]">
          <AddressButton>
            <div className="text-[14px] font-medium flex-1">
              {getFormattedAddress(account.address, 3, 2)}
            </div>
            <IdentIcon
              address={account.address}
              size={16}
              className="flex-none"
            />
          </AddressButton>
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-white focus:outline-none shadow-lg py-1">
            {onDisconnectClick && (
              <Menu.Item
                as="button"
                className="py-[6px] px-[16px] leading-[24px] hover:bg-light-green hover:text-primary transition-colors duration-150 ease-out block w-full text-left"
                onClick={onDisconnectClick}
              >
                Disconnect
              </Menu.Item>
            )}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
