import clsx from 'clsx';
import { PropsWithChildren } from 'react';

export interface TextProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
  isMono?: boolean;
}

export function Text({
  className,
  children,
  size = 'medium',
  isMono = false,
}: PropsWithChildren<TextProps>) {
  const classNames = clsx(
    'font-[500]',
    size === 'small' && 'text-[12px] sm:text-[13px] lg:text-[14px]',
    size === 'medium' &&
      'text-[13px] sm:text-[15px] lg:text-[16px] leading-[22px]',
    size === 'large' && 'text-[14px] sm:text-[17px] lg:text-[18px]',
    isMono ? 'font-mono uppercase' : 'font-serif',
    className,
  );

  return <span className={classNames}>{children}</span>;
}
