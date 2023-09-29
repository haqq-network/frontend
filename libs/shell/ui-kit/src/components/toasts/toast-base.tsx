import { PropsWithChildren } from 'react';

export function ToastBase({ children }: PropsWithChildren) {
  return (
    <div className="text-haqq-black max-w-lg gap-[8px] rounded-[8px] bg-white p-[16px] font-serif text-[20px] leading-[26px]">
      {children}
    </div>
  );
}
