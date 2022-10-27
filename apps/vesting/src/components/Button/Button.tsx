import { ReactNode, SyntheticEvent } from 'react';
import clsx from 'clsx';

export interface ButtonProps {
  children: ReactNode;
  className?: string;
  primary?: boolean;
  outline?: boolean;
  disabled?: boolean;
  fill?: boolean;
  type?: 'submit' | 'reset' | 'button';
  onClick?: (event: SyntheticEvent<HTMLButtonElement, MouseEvent>) => void;
}

export function Button({
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
      ? 'bg-transparent text-primary border-[2px] border-solid border-primary hover:text-[#20d775] hover:border-[#20d775]'
      : 'bg-primary text-white hover:bg-[#20d775]',
    'bg-primary text-white hover:bg-[#20d775]',
    'text-base font-semibold font-sans leading-[24px]',
    'rounded-[8px] py-[8px] px-[16px] appearance-none box-border',
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
      ? 'bg-transparent text-danger border-[2px] border-solid border-danger hover:text-[#ff0000] hover:border-[#ff0000]'
      : 'bg-danger text-white hover:bg-[#ff0000]',
    'text-base font-semibold font-sans leading-[24px]',
    'rounded-[8px] py-[8px] px-[16px] appearance-none box-border',
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
