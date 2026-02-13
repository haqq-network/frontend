import { PropsWithChildren } from 'react';

export function MyAccountCardBlock({
  title,
  children,
}: PropsWithChildren<{ title?: string }>) {
  return (
    <div className="flex flex-col items-start gap-y-[6px]">
      {title && (
        <div className="text-[10px] leading-[12px] font-medium text-white/50 uppercase lg:text-[12px] lg:leading-[14px]">
          {title}
        </div>
      )}
      <div className="text-[16px] leading-[26px] uppercase">{children}</div>
    </div>
  );
}
