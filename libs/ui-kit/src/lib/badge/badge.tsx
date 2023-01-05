import { ReactNode } from 'react';
import clsx from 'clsx';

/* eslint-disable-next-line */
export interface BadgeProps {
  children: ReactNode;
  className?: string;
  intent: 'success' | 'warning' | 'danger';
}

export function Badge({ children, className, intent = 'success' }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-block py-1 px-2.5 leading-tight text-center whitespace-nowrap align-baseline font-medium rounded-md',
        'text-white dark:bg-opacity-30 uppercase text-xs',
        {
          'bg-islamic-green-500': intent === 'success',
          'bg-yellow-400': intent === 'warning',
          'bg-islamic-red-500': intent === 'danger',
        },
        className,
      )}
    >
      {children}
    </span>
  );
}

export default Badge;
