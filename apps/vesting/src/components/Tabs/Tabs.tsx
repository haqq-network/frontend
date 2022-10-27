import { ReactNode } from 'react';
import clsx from 'clsx';

export interface TabsProps {
  children: ReactNode;
  className?: string;
}

export function Tabs({ children, className }: TabsProps) {
  return (
    <div
      className={clsx(
        'w-full flex flex-row p-[4px] space-x-[4px] rounded-[16px] bg-primary',
        className,
      )}
    >
      {children}
    </div>
  );
}

export interface TabProps {
  children: ReactNode;
  className?: string;
  isActive?: boolean;
}

export function Tab({ children, isActive = false }: TabProps) {
  return (
    <div
      className={clsx(
        'text-base leading-[22px] text-center',
        'p-[12px] rounded-[12px] flex-1 min-w-[120px]',
        'cursor-pointer transition-colors duration-150',
        isActive ? 'bg-white text-black' : 'text-white hover:text-black',
      )}
    >
      {children}
    </div>
  );
}
