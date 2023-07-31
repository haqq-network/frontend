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
    size === 'small' &&
      'text-[13px] md:text-[14px] lg:text-base leading-[20px]',
    size === 'medium' &&
      'text-[15px] md:text-[16px] leading-[22px] md:leading-[24px] lg:text-[18px] lg:leading-[26px]',
    size === 'large' && 'text-[14px] sm:text-[17px] lg:text-[18px]',
    isMono ? 'font-mono uppercase' : 'font-serif',
    className,
  );

  return <span className={classNames}>{children}</span>;
}
