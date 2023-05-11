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
        'inline-block text-center p-[12px] whitespace-nowrap rounded-lg',
        'text-white uppercase text-[14px] leading-none font-serif font-medium tracking-[.01em]',
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
