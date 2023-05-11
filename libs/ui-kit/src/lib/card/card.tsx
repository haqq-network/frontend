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
        'relative p-6 shadow-sm ring-1',
        // 'backdrop-blur-sm transform-gpu',
        'bg-white/50 shadow-slate-300/20 ring-gray-300/10',
        'dark:bg-slate-700/40 dark:shadow-slate-600/10 dark:ring-gray-500/10',
        { 'rounded-xl': rounded },
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeading({ children }: { children: ReactNode }) {
  return (
    <div className="text-sm font-medium uppercase leading-relaxed text-gray-400">
      {children}
    </div>
  );
}
