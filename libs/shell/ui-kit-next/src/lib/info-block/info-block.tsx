import { PropsWithChildren } from 'react';

export function InfoBlock({
  title,
  children,
}: PropsWithChildren<{ title?: string }>) {
  return (
    <div>
      {title && (
        <div className="font-sans text-[12px] leading-[18px] text-white/50">
          {title}
        </div>
      )}
      <div className="text-[14px] leading-[22px] text-white font-[500]">
        {children}
      </div>
    </div>
  );
}
