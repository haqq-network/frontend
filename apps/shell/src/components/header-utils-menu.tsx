import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import clsx from 'clsx';
import Link from 'next/link';
import { ArrowDownIcon } from '@haqq/shell-ui-kit/server';
import { headerUtilsLinks } from '../config/header-links';

export function HeaderUtilsMenu() {
  return (
    <Menu as="div" className="relative z-20 inline-block">
      <MenuButton
        as="button"
        className={clsx(
          'flex h-[40px] flex-row items-center rounded-[6px] px-[12px]',
          'font-guise text-[14px] font-[500] leading-[22px]',
          'transition-colors duration-150 ease-out',
          'box-border appearance-none outline-none',
          'hover:text-haqq-black border border-white text-white hover:bg-white',
          'data-[open]:!text-haqq-black group data-[open]:!bg-white',
        )}
      >
        <div className="mt-[-1px]">Utils</div>
        <ArrowDownIcon
          className={clsx(
            'mb-[-2px] ml-[4px] mr-[-6px]',
            'transition-[transform] duration-150 ease-in',
            'group-data-[open]:scale-y-[-1]',
          )}
        />
      </MenuButton>

      <MenuItems
        className={
          'bg-haqq-black border-haqq-border absolute left-[-1px] z-20 mt-[4px] w-fit origin-top rounded-[8px] border py-[8px] text-white shadow-lg focus:outline-none lg:right-[0px] lg:min-w-full'
        }
      >
        {headerUtilsLinks.map(({ name, link }) => {
          return (
            <MenuItem
              as="button"
              key={`${name}-${link}`}
              className={clsx(
                'block w-full min-w-fit whitespace-nowrap px-[16px] py-[10px] text-left text-[13px] leading-[20px] hover:bg-[#ffffff14]',
                'transition-colors duration-150 ease-out',
              )}
            >
              <Link href={link}>{name}</Link>
            </MenuItem>
          );
        })}
      </MenuItems>
    </Menu>
  );
}
