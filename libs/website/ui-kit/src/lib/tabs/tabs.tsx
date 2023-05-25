import { PropsWithChildren } from 'react';
import clsx from 'clsx';

export function Tabs({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={clsx(
        'md:border-[#C5C5C5] flex w-full items-start md:border-b-[2px]',
        className,
      )}
    >
      {children}
    </div>
  );
}

export interface TabProps {
  className?: string;
  isActive?: boolean;
  onClick: () => void;
}

export function Tab({
  children,
  isActive = false,
  onClick,
}: PropsWithChildren<TabProps>) {
  return (
    <div
      className={clsx(
        'px-[16px] py-[12px]',
        'font-sans text-[12px] leading-[1.5em] md:text-[13px] md:leading-[22px] lg:text-[14px] font-[500] ',
        'cursor-pointer transition-colors duration-150',
        'border-b-[2px]',
        'md:mb-[-2px]',
        isActive
          ? 'border-haqq-black text-haqq-black'
          : 'text-[#868686] border-[#C5C5C5]',
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
