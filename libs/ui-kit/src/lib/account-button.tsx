'use client';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import clsx from 'clsx';
import { ArrowDownIcon } from './icons';

export function AccountButton({
  balance,
  address,
  onDisconnectClick,
  className,
  withoutDropdown = false,
}: {
  balance?: string | number;
  address: string | undefined;
  onDisconnectClick?: () => void;
  className?: string;
  withoutDropdown?: boolean;
}) {
  return (
    <div
      className={clsx(
        'flex h-[40px] max-w-fit flex-row items-center',
        className,
      )}
    >
      {balance && (
        <div className="font-clash mr-[-8px] rounded-l-[6px] border border-r-0 border-white pb-[6px] pl-[12px] pr-[20px] pt-[8px] leading-[24px] tracking-[.01em]">
          {balance.toLocaleString()}&nbsp;ISLM
        </div>
      )}

      {!withoutDropdown && onDisconnectClick ? (
        <Menu as="div" className="relative z-10 inline-block h-[40px]">
          <MenuButton
            as="button"
            className={clsx(
              'flex h-full flex-row items-center space-x-[2px] py-[8px] pl-[12px] pr-[8px]',
              'cursor-pointer bg-white text-black hover:bg-[#cecfce] active:bg-white',
              'transition-colors duration-150 ease-in',
              'box-border appearance-none outline-none',
              'font-guise group appearance-none rounded-[6px] text-sm font-[500] leading-[24px]',
            )}
          >
            <div className="mt-[-1px]">{address}</div>
            <ArrowDownIcon
              className={clsx(
                'mb-[-2px] ml-[4px] mr-[-6px]',
                'transition-[transform] duration-150 ease-in',
                'group-data-[open]:scale-y-[-1]',
              )}
            />
          </MenuButton>

          <MenuItems className="border-haqq-border absolute right-[-1px] z-10 mt-1 w-[160px] origin-top-right rounded-md border bg-black py-2 text-white shadow-lg focus:outline-none">
            <MenuItem
              as="button"
              className="block w-full px-[16px] py-[10px] text-left text-[13px] leading-[22px] transition-colors duration-150 ease-out hover:bg-[#ffffff14]"
              onClick={onDisconnectClick}
            >
              Disconnect
            </MenuItem>
          </MenuItems>
        </Menu>
      ) : (
        <div
          className={clsx(
            'flex h-full flex-row items-center space-x-2 rounded-[6px] px-3 py-[9px]',
            'font-guise bg-white text-[14px] leading-[24px] text-black',
          )}
        >
          {address}
        </div>
      )}
    </div>
  );
}
