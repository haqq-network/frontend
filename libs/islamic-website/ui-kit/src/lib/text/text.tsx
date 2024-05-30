import { PropsWithChildren } from 'react';
import clsx from 'clsx';

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
      'text-[13px] md:text-[14px] lg:text-[16px] leading-[20px] lg:leading-[24px]',
    size === 'medium' &&
      'text-[15px] md:text-base leading-[22px] lg:text-[18px] lg:leading-[26px]',
    size === 'large' && 'text-[14px] sm:text-[17px] lg:text-[18px]',
    isMono ? 'font-vcr rtl:font-handjet uppercase' : 'font-alexandria',
    className,
  );

  return <span className={classNames}>{children}</span>;
}
