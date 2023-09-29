import clsx from 'clsx';
import { PropsWithChildren } from 'react';

export function Marquee({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div className="relative">
      <div className="absolute top-0 z-30 h-full w-[40px] from-transparent to-[#010304] ltr:left-0 ltr:bg-gradient-to-l rtl:right-0 rtl:bg-gradient-to-r md:w-[120px]" />
      <div
        className={clsx(
          'rtl:font-handjet font-vcr flex select-none gap-x-[1rem] overflow-hidden border-y border-[#2F2F2F] py-[4px]  text-[15px] leading-[22px] text-white/50 md:text-base lg:text-[18px] lg:leading-[26px]',
          className,
        )}
      >
        <div className="rtl:animate-scroll-left ltr:animate-scroll-right flex min-w-full shrink-0 justify-around gap-x-[1rem]">
          {children}
        </div>
        <div
          aria-hidden="true"
          className="rtl:animate-scroll-left ltr:animate-scroll-right flex min-w-full shrink-0 justify-around gap-x-[1rem]"
        >
          {children}
        </div>
      </div>
      <div className="absolute top-0 z-30 h-full w-[40px] from-[#010304] to-transparent ltr:right-0 ltr:bg-gradient-to-l rtl:left-0 rtl:bg-gradient-to-r md:w-[120px]" />
    </div>
  );
}
