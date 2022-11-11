import clsx from 'clsx';
import { ReactNode } from 'react';

export interface MaxBalanceButtonProps {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export function MaxBalanceButton({
  children,
  onClick,
  disabled,
  className,
}: MaxBalanceButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'bg-slate-500 text-white hover:bg-slate-500/90 ring-slate-500/40 focus:ring-2 outline-none dark:ring-slate-100/80',

        'text-xs font-semibold px-2 py-1 rounded h-[24px] ',

        'disabled:!bg-slate-500 disabled:!opacity-60 disabled:cursor-not-allowed',
        'transition-all duration-100',
        className,
      )}
    >
      {children}
    </button>
  );
}

export default MaxBalanceButton;
