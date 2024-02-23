import { ReactNode, SyntheticEvent } from 'react';
import clsx from 'clsx';
import { Loader } from '../Loader/Loader';

export interface ButtonProps {
  children: ReactNode;
  className?: string;
  primary?: boolean;
  outline?: boolean;
  disabled?: boolean;
  fill?: boolean;
  type?: 'submit' | 'reset' | 'button';
  onClick?: (event: SyntheticEvent<HTMLButtonElement, MouseEvent>) => void;
  isPending?: boolean;
}

export function Button({
  children,
  onClick,
  outline = false,
  disabled = false,
  fill = false,
  type = 'button',
  className,
  isPending = false,
}: ButtonProps) {
  const classNames = clsx(
    outline
      ? 'bg-transparent text-primary border-[1px] border-solid border-primary hover:text-[#20d775] hover:border-[#20d775] py-[10px]'
      : 'bg-primary text-white hover:bg-[#20d775] py-[11px]',
    'text-[14px] font-semibold font-sans leading-[20px]',
    'rounded-[8px] px-[16px] appearance-none relative',
    'transition-colors duration-150 ease-linear',
    fill ? 'w-full' : 'inline-block',
    disabled && 'opacity-75 cursor-not-allowed',
    isPending && 'cursor-wait',
    className,
  );

  return (
    <button
      type={type}
      onClick={onClick}
      className={classNames}
      disabled={disabled || isPending}
    >
      <span className={clsx(isPending && 'invisible')}>{children}</span>

      <Loader
        className={clsx(
          'pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
          isPending ? 'visible' : 'invisible',
        )}
      />
    </button>
  );
}

export function DangerButton({
  children,
  onClick,
  outline = false,
  disabled = false,
  fill = false,
  type = 'button',
  className,
}: ButtonProps) {
  const classNames = clsx(
    outline
      ? 'bg-transparent text-danger border-[1px] border-solid border-danger hover:text-[#ff0000] hover:border-[#ff0000] py-[10px]'
      : 'bg-danger text-white hover:bg-[#ff0000] py-[11px]',
    'text-[14px] font-semibold font-sans leading-[20px]',
    'rounded-[8px] px-[16px] appearance-none box-border',
    'transition-colors duration-150 ease-linear',
    fill ? 'w-full' : 'inline-block',
    { 'opacity-75 cursor-not-allowed': disabled },
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
