import { PropsWithChildren } from 'react';
import { SpinnerLoader } from './spinner-loader';

export function ToastBase({ children }: PropsWithChildren) {
  return (
    <div className="text-haqq-black font-clash max-w-lg gap-[8px] rounded-[8px] bg-white p-[16px] text-[20px] leading-[26px] shadow-lg">
      {children}
    </div>
  );
}

export function ToastSuccess({ children }: PropsWithChildren) {
  return <ToastBase>{children}</ToastBase>;
}

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

export function ToastError({
  onDismiss,
  children,
}: PropsWithChildren<{ onDismiss?: () => void }>) {
  return (
    <ToastBase>
      <div
        onClick={onDismiss}
        className="flex flex-row items-center gap-[16px]"
      >
        <div className="self-start">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12ZM22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM11 17V15H13V17H11ZM13 14V7H11V14H13Z"
              fill="#FF5454"
            />
          </svg>
        </div>

        <div>{children}</div>
      </div>
    </ToastBase>
  );
}
