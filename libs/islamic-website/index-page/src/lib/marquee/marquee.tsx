import clsx from 'clsx';
import { PropsWithChildren } from 'react';
import styles from './marquee.module.css';

export function Marquee({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={clsx(
        'relative flex select-none gap-x-[1rem] overflow-hidden border-y border-[#2F2F2F] py-[4px] font-mono text-[15px] leading-[22px] text-white/50 md:text-base lg:text-[18px] lg:leading-[26px]',
        className,
      )}
    >
      <div className="absolute left-0 top-0 z-30 h-full w-[40px] bg-gradient-to-l from-transparent to-[#010304] rtl:right-0 md:w-[120px]" />
      <div
        className={clsx(
          'flex min-w-full shrink-0 justify-around gap-x-[1rem]',
          styles['marquee__content'],
        )}
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        className={clsx(
          'flex min-w-full shrink-0 justify-around gap-x-[1rem]',
          styles['marquee__content'],
        )}
      >
        {children}
      </div>
      <div className="absolute right-0 top-0 z-30 h-full w-[40px] bg-gradient-to-l from-[#010304] to-transparent rtl:left-0 md:w-[120px]" />
    </div>
  );
}
