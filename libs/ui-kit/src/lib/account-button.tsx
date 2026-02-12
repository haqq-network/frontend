'use client';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { useTranslate } from '@tolgee/react';
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
  const { t } = useTranslate('common');

  return (
    <div
      className={clsx(
        'flex h-[40px] max-w-fit flex-row items-center',
        className,
      )}
    >
      {balance && (
        <div className="font-clash me-[-8px] rounded-s-[6px] border border-e-0 border-white ps-[12px] pe-[20px] pt-[8px] pb-[6px] leading-[24px] tracking-[.01em]">
          {balance.toLocaleString()}&nbsp;ISLM
        </div>
      )}

      {!withoutDropdown ? (
        <Menu as="div" className="relative z-10 inline-block h-[40px]">
          <MenuButton
            as="button"
            className={clsx(
              'flex h-full flex-row items-center space-x-[2px] py-[8px] ps-[12px] pe-[8px] rtl:space-x-reverse',
              'cursor-pointer bg-white text-black hover:bg-[#cecfce] active:bg-white',
              'transition-colors duration-150 ease-in',
              'box-border appearance-none outline-none',
              'font-guise group appearance-none rounded-[6px] text-sm leading-[24px] font-medium',
            )}
          >
            <div className="-mt-px">{address}</div>
            <ArrowDownIcon
              className={clsx(
                'ms-[4px] me-[-6px] mb-[-2px]',
                'transition-[transform] duration-150 ease-in',
                'group-data-open:scale-y-[-1]',
              )}
            />
          </MenuButton>

          <MenuItems className="border-haqq-border absolute -end-px z-10 mt-1 w-[160px] rounded-md border bg-black py-2 text-white shadow-lg focus:outline-none ltr:origin-top-right rtl:origin-top-left">
            {onDisconnectClick && (
              <MenuItem
                as="button"
                className="block w-full px-[16px] py-[10px] text-start text-[13px] leading-[22px] transition-colors duration-150 ease-out hover:bg-[#ffffff14]"
                onClick={onDisconnectClick}
              >
                {t('disconnect', 'Disconnect')}
              </MenuItem>
            )}
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
