import { ReactNode } from 'react';
import clsx from 'clsx';

export function Card({
  children,
  className,
  rounded = true,
}: {
  children: ReactNode;
  className?: string;
  rounded?: boolean;
}) {
  return (
    <div
      className={clsx(
        'relative p-6 shadow-lg ring-1',
        'backdrop-blur transform-gpu',
        'bg-white/50 ring-gray-300/10 shadow-slate-300/20',
        'dark:bg-slate-700/40 dark:ring-gray-500/10 dark:shadow-slate-600/10',
        { 'rounded-xl': rounded },
        className,
      )}
    >
      {children}
    </div>
  );
}
