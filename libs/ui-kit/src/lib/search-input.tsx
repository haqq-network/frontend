'use client';
import { useTranslate } from '@tolgee/react';
import clsx from 'clsx';
import { MagnifierIcon } from './icons';

export function SearchInput({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const { t } = useTranslate('common');
  return (
    <div className="relative">
      <MagnifierIcon className="absolute start-[16px] top-[12px] h-[24px] w-[24px] text-[#FFFFFF80]" />
      <input
        type="text"
        className={clsx(
          'w-full rounded-[6px] outline-none',
          'transition-colors duration-100 ease-in',
          'text-white placeholder:text-[#FFFFFF3D]',
          'py-[12px] pe-[16px] ps-[48px] text-[14px] font-medium leading-[22px]',
          'bg-[#252528] hover:bg-[#3A3A3A] focus:bg-[#3A3A3A]',
          className,
        )}
        placeholder={t('search-by-name', 'Search by name')}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        value={value}
      />
    </div>
  );
}
