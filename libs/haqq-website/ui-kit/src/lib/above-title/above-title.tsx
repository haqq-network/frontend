import { ReactNode } from 'react';
import clsx from 'clsx';

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
