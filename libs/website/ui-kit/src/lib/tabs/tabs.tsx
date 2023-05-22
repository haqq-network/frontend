import { PropsWithChildren } from 'react';
import clsx from 'clsx';

export interface TabProps {
  className?: string;
  isActive?: boolean;
}

export function Tabs({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={clsx(
        'bg-primary flex w-full flex-row space-x-[4px] rounded-[16px] p-[4px]',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Tab({
  children,
  isActive = false,
}: PropsWithChildren<TabProps>) {
  return (
    <div
      className={clsx(
        'text-center text-base leading-[22px]',
        'min-w-[120px] flex-1 rounded-[12px] p-[12px]',
        'cursor-pointer transition-colors duration-150',
        isActive ? 'bg-white text-black' : 'text-white hover:text-black',
      )}
    >
      {children}
    </div>
  );
}
