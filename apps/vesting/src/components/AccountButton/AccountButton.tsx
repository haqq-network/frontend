// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { Fragment, ReactElement, ReactNode } from 'react';
import { Menu, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { getFormattedAddress } from '@haqq/shared';
import { formatLocaleNumber } from '../../utils/format-number-locale';
import { Button } from '../Button/Button';

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
    <div className="bg-primary flex flex-row rounded-[8px]">
      {account.balance && (
        <BalanceButton onClick={onBalanceClick} className="hidden sm:block">
          <div className="mb-[-3px] font-bold">
            {formatLocaleNumber(account.balance.value)}{' '}
            {account.balance.symbol.toLocaleUpperCase()}
          </div>
        </BalanceButton>
      )}

      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button as="div" className="bg-primary rounded-[8px] p-[2px]">
          <AddressButton>
            <div className="flex-1 text-[14px] font-medium">
              {getFormattedAddress(account.address, 3, 2)}
            </div>
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
          <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-white py-1 shadow-lg focus:outline-none">
            {onDisconnectClick && (
              <Menu.Item
                as="button"
                className="hover:bg-light-green hover:text-primary block w-full px-[16px] py-[6px] text-left leading-[24px] transition-colors duration-150 ease-out"
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
