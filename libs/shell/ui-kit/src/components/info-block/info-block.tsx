import { PropsWithChildren } from 'react';
import clsx from 'clsx';

export function InfoBlock({
  title,
  children,
  className,
}: PropsWithChildren<{ title?: string; className?: string }>) {
  return (
    <div className="flex flex-col gap-[4px]">
      {title && (
        <div className="font-guise text-[11px] leading-[18px] text-white/50 md:text-[12px] md:leading-[18px]">
          {title}
        </div>
      )}
      <div
        className={clsx(
          'text-[12px] font-[500] leading-[18px] text-white md:text-[14px] md:leading-[22px]',
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
