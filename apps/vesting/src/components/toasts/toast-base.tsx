import { PropsWithChildren } from 'react';

export function ToastBase({ children }: PropsWithChildren) {
  return (
    <div className="font-clash max-w-lg gap-[8px] rounded-[8px] bg-white p-[16px] text-[20px] leading-[26px] text-[#2E2E2E] shadow-lg">
      {children}
    </div>
  );
}
