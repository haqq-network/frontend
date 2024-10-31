'use client';
import { useRef } from 'react';
import clsx from 'clsx';
import { useHover } from 'usehooks-ts';
import { GlobeIcon, CheckIcon } from './icons';

export type LocaleOption = {
  id: string;
  label: string;
  emoji: string;
};

type LocaleDropdownProps = {
  locales: LocaleOption[];
  switchLocale?: (locale: string) => void;
  currentLocale: string;
};

export function LocaleDropdown({
  locales,
  switchLocale,
  currentLocale,
}: LocaleDropdownProps) {
  const hoverRef = useRef(null);
  const isHover = useHover(hoverRef);

  return (
    <div className="relative" ref={hoverRef}>
      <GlobeIcon className="h-[24px] w-[24px] cursor-pointer" />

      <div
        className={clsx(
          'absolute left-1/2 top-full z-50 origin-top -translate-x-1/2',
          'min-w-[150px] pt-[4px]',
          isHover ? 'visible' : 'invisible',
        )}
      >
        <div
          className={clsx(
            'py-[8px]',
            'bg-haqq-black border-haqq-border border text-white',
            'rounded-[8px] shadow-lg focus:outline-none',
          )}
        >
          <div className="flex flex-col gap-[8px]">
            {locales.map(({ id, label, emoji }) => {
              const isActive = id === currentLocale;
              return (
                <button
                  key={id}
                  className={clsx(
                    'flex w-full min-w-fit items-center justify-between whitespace-nowrap px-[16px] py-[10px] text-left text-[13px] leading-[20px] hover:bg-[#ffffff14]',
                    'transition-colors duration-150 ease-out',
                  )}
                  onClick={() => {
                    return switchLocale?.(id);
                  }}
                >
                  <span className="flex h-[20px] flex-row items-center">
                    <span role="img" className="mr-2 inline-block text-[20px]">
                      {emoji}
                    </span>
                    <span>{label}</span>
                  </span>
                  <CheckIcon
                    className={clsx(
                      'mb-[-1px] ml-4 h-4 w-4',
                      isActive ? 'visible' : 'invisible',
                    )}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
