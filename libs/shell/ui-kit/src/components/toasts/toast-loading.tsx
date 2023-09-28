import { PropsWithChildren } from 'react';
import { ToastBase } from './toast-base';
import { SpinnerLoader } from '../spinner-loader/spinner-loader';

export function ToastLoading({ children }: PropsWithChildren) {
  return (
    <ToastBase>
      <div
        role="status"
        className="flex flex-row items-center gap-[16px] text-black"
      >
        <SpinnerLoader className="!h-[18px] !w-[18px]" />

        <div>{children}</div>
      </div>
    </ToastBase>
  );
}
