'use client';
import { Fragment, useMemo } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import clsx from 'clsx';

export function SortSelect({
  current,
  variants,
  onChange,
  className,
  placeholder,
}: {
  current: null | string;
  variants: Array<{ id: string; title: string }>;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}) {
  const currentValue = useMemo(() => {
    return variants.find(({ id }) => {
      return id === current;
    });
  }, [current, variants]);

  const optionsToRender = useMemo(() => {
    return variants.map(({ id, title }) => {
      return (
        <MenuItem
          as="button"
          key={id}
          className={clsx(
            'block w-full min-w-fit whitespace-nowrap px-[16px] py-[10px] text-left text-[13px] leading-[20px] hover:bg-[#ffffff14]',
            'transition-colors duration-150 ease-out',
          )}
          onClick={() => {
            onChange(id);
          }}
        >
          {title}
        </MenuItem>
      );
    });
  }, [onChange, variants]);

  return (
    <Menu as="div" className={clsx('relative inline-block w-full', className)}>
      <MenuButton
        as="button"
        className={clsx(
          'flex h-[48px] flex-row items-center justify-between gap-[6px] rounded-[6px] px-[16px] py-[12px]',
          'box-border w-full appearance-none rounded-[6px] outline-none',
          'transition-colors duration-100 ease-in',
          'group text-[#fffff]',
          'px-[16px] py-[12px] text-[14px] font-[500] leading-[22px]',
          'data-[open]:bg-[#3A3A3A] [&:not([data-open])]:bg-[#252528] [&:not([data-open])]:hover:bg-[#3A3A3A]',
        )}
      >
        <div>
          {currentValue ? (
            <span>{currentValue.title}</span>
          ) : (
            <span className="text-[#fff]">{placeholder}</span>
          )}
        </div>

        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          className={clsx(
            'mb-[-2px]',
            'transition-transform duration-150 ease-in',
            'group-data-[open]:scale-y-[-1]',
          )}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.85156 8.89817L6.14793 7.60181L10.9997 12.4536L15.8516 7.60181L17.1479 8.89817L10.9997 15.0464L4.85156 8.89817Z"
            fill="currentColor"
          />
        </svg>
      </MenuButton>

      <MenuItems
        className={clsx(
          'absolute left-[0px] z-10 mt-[4px] w-fit min-w-full origin-top rounded-[8px] bg-[#0D0D0E] py-[8px] shadow-lg focus:outline-none',
          'max-h-[256px] overflow-y-scroll',
          'border-haqq-border border-[1px]',
        )}
      >
        {optionsToRender}
      </MenuItems>
    </Menu>
  );
}
