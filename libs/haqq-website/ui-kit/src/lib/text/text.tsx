import clsx from 'clsx';
import { PropsWithChildren } from 'react';

export interface TextProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export function Text({
  className,
  children,
  size = 'medium',
}: PropsWithChildren<TextProps>) {
  const classNames = clsx(
    'font-sans font-[500] leading-[1.6em]',
    size === 'small' && 'text-[12px] sm:text-[13px] lg:text-[14px]',
    size === 'medium' && 'text-[13px] sm:text-[15px] lg:text-[16px]',
    size === 'large' && 'text-[14px] sm:text-[17px] lg:text-[18px]',
    className,
  );

  return <div className={classNames}>{children}</div>;
}
