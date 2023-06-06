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
        'rounded-md px-4 py-2.5 text-xs font-medium uppercase leading-tight shadow',
        'bg-islamic-green-500 text-white',
        'hover:bg-islamic-green-600 hover:shadow-md',
        'focus:bg-islamic-green-600 focus:ring-islamic-green-500 focus:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2',
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
    'font-sans text-base font-medium leading-[24px]',
    'box-border appearance-none rounded-[6px] py-2 px-5',
    'bg-slate-500 text-white outline-none ring-slate-600/40 hover:bg-slate-500/90 focus:ring-2 dark:ring-slate-100/80 active:bg-slate-600/90',
    'disabled:cursor-not-allowed disabled:!bg-slate-500 disabled:!opacity-60 disabled:!shadow-sm',
    'transition-all duration-150 ease-in',
    fill ? 'w-full' : 'inline-block',
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
