// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { getFormattedAddress } from '../utils/get-formatted-address';

export function AccountButton({
  balance,
  address,
  onDisconnectClick,
}: {
  balance?: {
    symbol: string;
    value: number;
  };
  address: string;
  onDisconnectClick: () => void;
}) {
  return (
    <div className="flex flex-row items-center rounded-[6px] text-white bg-slate-500">
      {balance && (
        <div className="font-medium leading-[24px] pl-[12px] py-[8px] pr-[8px]">
          {`${balance.value.toLocaleString()} ${balance.symbol.toLocaleUpperCase()}`}
        </div>
      )}
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button as="div" className="rounded-[8px] p-[2px]">
          <button
            className={clsx(
              'flex flex-row items-center space-x-2 rounded-[4px] h-[36px] px-[8px] py-[6px]',
              'cursor-pointer bg-slate-100 hover:bg-slate-200/90 active:bg-slate-100 text-slate-800',
              'transition-all duration-150 ease-in',
              'box-border appearance-none outline-none',
              // 'ring-slate-100/80 focus:ring-2',
            )}
          >
            {/* <IdentIcon
              address={account.address}
              size={16}
              className="flex-none"
            /> */}
            {/* <div className="h-5 w-5 rounded-full bg-slate-500" /> */}

            <div className="text-sm leading-[24px]">
              {getFormattedAddress(address, 3, 2)}
            </div>
          </button>
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
          <Menu.Items className="absolute right-0 mt-1 w-[160px] origin-top-right rounded-md bg-white focus:outline-none shadow-lg py-1 text-slate-800">
            {onDisconnectClick && (
              <Menu.Item
                as="button"
                className="py-[6px] px-[16px] leading-[24px] hover:bg-slate-500 hover:text-white transition-colors duration-150 ease-out block w-full text-left"
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
