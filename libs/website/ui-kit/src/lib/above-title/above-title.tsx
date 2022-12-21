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
        'font-sans font-[600] uppercase text-[10px] leading-[1.2em] sm:text-[12px]',
        className,
      )}
    >
      {children}
    </div>
  );
}
