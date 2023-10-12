import { PropsWithChildren } from 'react';

export function SmallText({ children }: PropsWithChildren) {
  return (
    <span className="font-guise text-[12px] font-[500] leading-[18px] text-white md:text-[14px] md:leading-[22px]">
      {children}
    </span>
  );
}
