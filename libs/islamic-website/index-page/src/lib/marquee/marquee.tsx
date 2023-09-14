import clsx from 'clsx';
import { PropsWithChildren } from 'react';

export function Marquee({
  children,
  className,
  locale,
}: PropsWithChildren<{ className?: string; locale: string }>) {
  return (
    <div
      className={clsx(
        'relative flex select-none gap-x-[1rem] overflow-hidden border-y border-[#2F2F2F] py-[4px] font-mono text-[15px] leading-[22px] text-white/50 md:text-base lg:text-[18px] lg:leading-[26px]',
        className,
      )}
    >
      <div className="absolute top-0 z-30 h-full w-[40px] from-transparent to-[#010304] ltr:left-0 ltr:bg-gradient-to-l rtl:right-0 rtl:bg-gradient-to-r md:w-[120px]" />
      <div
        className={clsx(
          'flex min-w-full shrink-0 justify-around gap-x-[1rem]',
          locale === 'ar' ? 'animate-scroll-left' : 'animate-scroll-right',
        )}
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        className={clsx(
          'flex min-w-full shrink-0 justify-around gap-x-[1rem]',
          locale === 'ar' ? 'animate-scroll-left' : 'animate-scroll-right',
        )}
      >
        {children}
      </div>
      <div className="absolute top-0 z-30 h-full w-[40px] from-[#010304] to-transparent ltr:right-0 ltr:bg-gradient-to-l rtl:left-0 rtl:bg-gradient-to-r md:w-[120px]" />
    </div>
  );
}
