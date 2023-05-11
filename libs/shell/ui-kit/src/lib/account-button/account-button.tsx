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
  withoutDropdown = false,
}: {
  balance?: {
    symbol: string;
    value: number;
  };
  address: string | undefined;
  onDisconnectClick?: () => void;
  className?: string;
  withoutDropdown?: boolean;
}) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  return (
    <div className={clsx('flex flex-row max-w-fit items-center', className)}>
      {balance && (
        <div className="font-serif tracking-[.01em] leading-[24px] pl-[12px] pt-[9px] pb-[7px] pr-[20px] rounded-l-[6px] border border-white border-r-0 mr-[-8px]">
          {`${balance.value.toLocaleString()} ${balance.symbol.toLocaleUpperCase()}`}
        </div>
      )}

      {!withoutDropdown && onDisconnectClick ? (
        <Menu as="div" className="relative inline-block z-10">
          <Menu.Button
            className={clsx(
              'h-full flex flex-row items-center space-x-[2px] pl-[12px] py-[9px] pr-[8px]',
              'cursor-pointer bg-white hover:bg-[#cecfce] active:bg-white text-black',
              'transition-all duration-150 ease-in',
              'box-border appearance-none outline-none',
              'font-sans font-[500] text-sm leading-[24px] rounded-[6px] appearance-none',
            )}
            onClick={() => {
              setDropdownOpen(!isDropdownOpen);
            }}
          >
            <span>{getFormattedAddress(address, 3, 2)}</span>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.85156 8.89817L6.14793 7.60181L10.9997 12.4536L15.8516 7.60181L17.1479 8.89817L10.9997 15.0464L4.85156 8.89817Z"
                fill="currentColor"
              />
            </svg>
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
            <Menu.Items className="absolute right-[-2px] mt-1 w-[160px] border border-[#ffffff26] origin-top-right rounded-md bg-black focus:outline-none shadow-lg py-2 text-white z-10">
              <Menu.Item
                as="button"
                className="py-2 px-[16px] leading-[22px] hover:bg-[#ffffff14] transition-colors duration-150 ease-out block w-full text-left"
                onClick={onDisconnectClick}
              >
                Disconnect
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      ) : (
        <div
          className={clsx(
            'h-full flex flex-row items-center space-x-2 rounded-[6px] px-3 py-[9px]',
            'bg-white text-black font-sans text-sm leading-[24px]',
          )}
          onClick={() => {
            setDropdownOpen(!isDropdownOpen);
          }}
        >
          {getFormattedAddress(address, 3, 2)}
        </div>
      )}
    </div>
  );
}
