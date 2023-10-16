import { PropsWithChildren } from 'react';

export function ToastBase({ children }: PropsWithChildren) {
  return (
    <div className="text-haqq-black font-clash max-w-lg gap-[8px] rounded-[8px] bg-white p-[16px] text-[20px] leading-[26px] shadow-lg">
      {children}
    </div>
  );
}
