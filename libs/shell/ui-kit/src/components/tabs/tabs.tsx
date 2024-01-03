import { PropsWithChildren } from 'react';
import clsx from 'clsx';

export function Tabs({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={clsx(
        'border-haqq-border flex w-full flex-row items-start border-b',
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
  onClick,
}: PropsWithChildren<{
  className?: string;
  isActive?: boolean;
  onClick: () => void;
}>) {
  return (
    <div
      className={clsx(
        'px-[16px] py-[12px]',
        'font-guise text-[12px] font-[600px] leading-[18px] text-white',
        'cursor-pointer transition-colors duration-150',
        'border-b-[2px] border-solid',
        'mb-[-1px]',
        isActive ? 'border-white' : 'border-transparent',
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
