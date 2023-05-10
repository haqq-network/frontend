// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { getFormattedAddress } from '@haqq/shared';

export function AccountButton({
  balance,
  address,
  onDisconnectClick,
  className,
}: {
  balance?: {
    symbol: string;
    value: number;
  };
  address: string | undefined;
  onDisconnectClick?: () => void;
  className?: string;
}) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  return (
    <div
      className={clsx(
        'lg:flex flex-row items-center rounded-[6px] outline outline-white',
        className,
      )}
    >
      {balance && (
        <div className="font-serif tracking-[.01em] leading-[24px] pl-[12px] py-[8px] pr-[8px]">
          {`${balance.value.toLocaleString()} ${balance.symbol.toLocaleUpperCase()}`}
        </div>
      )}
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button as="div" className="rounded-[8px]">
          <button
            className={clsx(
              'h-full flex flex-row items-center space-x-2 rounded-[6px] px-3 py-[9px]',
              'cursor-pointer bg-white hover:bg-white/80 active:bg-white text-black',
              'transition-all duration-150 ease-in',
              'box-border appearance-none outline-none',
            )}
            onClick={() => setDropdownOpen(!isDropdownOpen)}
          >
            <div className="font-sans text-sm leading-[24px]">
              {getFormattedAddress(address, 3, 2)}
            </div>
            <div className={clsx({ 'rotate-180': isDropdownOpen })}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.85156 8.89817L6.14793 7.60181L10.9997 12.4536L15.8516 7.60181L17.1479 8.89817L10.9997 15.0464L4.85156 8.89817Z"
                  fill="#0D0D0E"
                />
              </svg>
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
          <Menu.Items className="absolute right-0 mt-1 w-[160px] border border-[#ffffff26] origin-top-right rounded-md bg-black focus:outline-none shadow-lg py-2 text-white">
            {onDisconnectClick && (
              <Menu.Item
                as="button"
                className="py-2 px-[16px] leading-[22px] hover:bg-[#ffffff14] transition-colors duration-150 ease-out block w-full text-left"
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
