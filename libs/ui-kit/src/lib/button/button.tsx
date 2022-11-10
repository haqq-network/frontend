import { ReactNode, SyntheticEvent } from 'react';
import clsx from 'clsx';
export interface ButtonProps {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Button({
  onClick,
  disabled = false,
  children,
  className,
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        'px-4 py-2.5 font-medium text-xs leading-tight uppercase rounded-md shadow',
        'bg-islamic-green-500 text-white',
        'hover:bg-islamic-green-600 hover:shadow-md',
        'focus:bg-islamic-green-600 focus:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-islamic-green-500',
        'active:bg-islamic-green-700 active:shadow-sm',
        'disabled:!bg-islamic-green-500 disabled:!opacity-60 disabled:!shadow-sm',
        'transition duration-150 ease-out',
        className,
      )}
    >
      {children}
    </button>
  );
}

export interface Button2Props {
  children: ReactNode;
  className?: string;
  primary?: boolean;
  outline?: boolean;
  disabled?: boolean;
  fill?: boolean;
  type?: 'submit' | 'reset' | 'button';
  onClick?: (event: SyntheticEvent<HTMLButtonElement, MouseEvent>) => void;
}

export function Button3({
  children,
  onClick,
  outline = false,
  disabled = false,
  fill = false,
  type = 'button',
  className,
}: Button2Props) {
  const classNames = clsx(
    outline
      ? 'bg-transparent text-islamic-green-500 border-[2px] border-solid border-islamic-green-500 hover:text-islamic-green-600 hover:border-islamic-green-400'
      : 'bg-islamic-green-500 text-white hover:bg-islamic-green-600',
    'bg-islamic-green-500 text-white hover:bg-islamic-green-600',
    'text-base font-semibold font-sans leading-[24px]',
    'rounded-[8px] py-[8px] px-[16px] appearance-none box-border',
    'transition-colors duration-150 ease-linear',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-islamic-green-500',
    fill ? 'w-full' : 'inline-block',
    'disabled:!bg-islamic-green-500 disabled:!opacity-60 disabled:!shadow-sm disabled:cursor-not-allowed',
    className,
  );

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={classNames}
    >
      {children}
    </button>
  );
}

export function Button2({
  children,
  onClick,
  disabled = false,
  fill = false,
  type = 'button',
  className,
}: Button2Props) {
  const classNames = clsx(
    'text-base font-semibold font-sans leading-[24px]',
    'rounded-[8px] py-[8px] px-[16px] appearance-none box-border',
    'transition-all duration-150',
    // 'focus:outline-none focus:ring-2 dark:focus:ring-slate-200 focus:ring-slate-700',
    fill ? 'w-full' : 'inline-block',
    'disabled:!bg-slate-500 disabled:!opacity-60 disabled:!shadow-sm disabled:cursor-not-allowed',
    'bg-slate-500 text-white hover:bg-slate-500/90 ring-slate-500/40 focus:ring-4 outline-none dark:ring-slate-100/80',
    className,
  );

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={classNames}
    >
      {children}
    </button>
  );
}
