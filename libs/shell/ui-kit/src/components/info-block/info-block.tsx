import { PropsWithChildren } from 'react';

export function InfoBlock({
  title,
  children,
}: PropsWithChildren<{ title?: string }>) {
  return (
    <div className="flex flex-col gap-[4px]">
      {title && (
        <div className="font-sans text-[11px] leading-[18px] text-white/50 md:text-[12px] md:leading-[18px]">
          {title}
        </div>
      )}
      <div className="text-[12px] font-[500] leading-[18px] text-white md:text-[14px] md:leading-[22px]">
        {children}
      </div>
    </div>
  );
}
