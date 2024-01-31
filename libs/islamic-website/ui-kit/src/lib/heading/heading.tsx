import { PropsWithChildren } from 'react';
import clsx from 'clsx';

interface HeadingProps {
  level?: 1 | 2 | 3 | 4;
  className?: string;
}

/**
 * @level1 80px
 * @level2 64px default
 * @level3 42px
 * @level4 24px
 */

export function Heading({
  level = 2,
  children,
  className,
}: PropsWithChildren<HeadingProps>) {
  if (level === 1) {
    return (
      <h1
        className={clsx(
          'font-alexandria text-[18px] font-[600] sm:text-[28px] lg:text-[48px] xl:text-[80px] xl:leading-[88px]',
          className,
        )}
      >
        {children}
      </h1>
    );
  }
  if (level === 2) {
    return (
      <h2
        className={clsx(
          'font-alexandria text-[28px] font-[600] leading-[32px] md:text-[44px] md:leading-[48px] lg:text-[64px] lg:leading-[70px]',
          className,
        )}
      >
        {children}
      </h2>
    );
  }
  if (level === 3) {
    return (
      <h3
        className={clsx(
          'font-alexandria text-[16px] font-[600] leading-[1.2em] sm:text-[18px] lg:text-[22px] xl:text-[42px]',
          className,
        )}
      >
        {children}
      </h3>
    );
  }
  if (level === 4) {
    return (
      <h4
        className={clsx(
          'font-alexandria text-[14px] font-[600] leading-[1.2em] sm:text-[16px] lg:text-[18px] xl:text-[24px] xl:leading-[34px]',
          className,
        )}
      >
        {children}
      </h4>
    );
  }
}
