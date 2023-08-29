import clsx from 'clsx';
import { ReactNode } from 'react';

export interface AboveTitleProps {
  children: ReactNode;
  className?: string;
}

export function AboveTitle({ children, className }: AboveTitleProps) {
  return (
    <div
      className={clsx(
        'font-sans text-[10px] font-[600] uppercase leading-[1.2em] sm:text-[12px]',
        className,
      )}
    >
      {children}
    </div>
  );
}
