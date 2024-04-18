import { PropsWithChildren } from 'react';
import clsx from 'clsx';

export function Marquee({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <section>
      <div className="relative">
        <div className="absolute left-0 top-0 z-30 h-full w-[40px] bg-gradient-to-l from-transparent to-[#010304] md:w-[120px] rtl:right-0 rtl:bg-gradient-to-r" />
        <div
          className={clsx(
            'rtl:font-handjet font-vcr flex select-none gap-x-[1rem] overflow-hidden border-y border-[#2F2F2F] py-[4px] text-[15px] leading-[22px] text-white/50 md:text-base lg:text-[18px] lg:leading-[26px]',
            className,
          )}
        >
          <div className="rtl:animate-scroll-left animate-scroll-right flex min-w-full shrink-0 justify-around gap-x-[1rem]">
            {children}
          </div>
          <div
            aria-hidden="true"
            className="rtl:animate-scroll-left animate-scroll-right flex min-w-full shrink-0 justify-around gap-x-[1rem]"
          >
            {children}
          </div>
        </div>
        <div className="absolute right-0 top-0 z-30 h-full w-[40px] bg-gradient-to-l from-[#010304] to-transparent md:w-[120px] rtl:left-0 rtl:bg-gradient-to-r" />
      </div>
    </section>
  );
}
