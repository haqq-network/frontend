import { PropsWithChildren } from 'react';
import clsx from 'clsx';

export interface BadgeProps {
  className?: string;
  intent: 'success' | 'warning' | 'danger';
}

export function Badge({
  children,
  className,
  intent = 'success',
}: PropsWithChildren<BadgeProps>) {
  return (
    <span
      className={clsx(
        'inline-block whitespace-nowrap rounded-lg p-[12px] text-center',
        'font-serif text-[14px] font-medium uppercase leading-none tracking-[.01em] text-white',
        {
          'bg-[#01B26E]': intent === 'success',
          'bg-[#E3A13F]': intent === 'warning',
          'bg-[#FF5454]': intent === 'danger',
        },
        className,
      )}
    >
      {children}
    </span>
  );
}

export default Badge;
