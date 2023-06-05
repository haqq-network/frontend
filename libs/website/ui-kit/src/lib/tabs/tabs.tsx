import { PropsWithChildren } from 'react';
import clsx from 'clsx';

export function Tabs({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={clsx(
        'flex w-full items-start md:border-b-[2px] md:border-[#C5C5C5]',
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
  className,
}: PropsWithChildren<TabProps>) {
  return (
    <div
      className={clsx(
        'px-[16px] py-[12px]',
        'font-sans text-[12px] font-[500] leading-[1.5em] md:text-[13px] md:leading-[22px] lg:text-[14px]',
        'cursor-pointer transition-colors duration-150',
        'border-b-[2px]',
        'md:mb-[-2px]',
        isActive
          ? 'border-haqq-black text-haqq-black'
          : 'border-[#C5C5C5] text-[#868686]',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
