import clsx from 'clsx';
import { ReactNode } from 'react';

export interface ButtonProps {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  variant?: 1 | 2 | 3 | 4;
  disabled?: boolean;
  type?: 'submit' | 'button' | 'reset';
}

export function Button({
  onClick,
  className,
  variant = 1,
  disabled = false,
  children,
  type = 'button',
}: ButtonProps) {
  const classNames = clsx(
    'p-2 text-[14px] font-serif leading-[14px] font-[500] tracking-[0.01em] rounded-[6px] h-[40px] uppercase px-[32px] py-[13px] cursor-pointer user-select-none',
    variant === 1 &&
      'text-white border-white border hover:bg-white hover:text-haqq-black disabled:!text-white disabled:!bg-transparent',
    variant === 2 &&
      'text-haqq-black bg-white border-white border hover:bg-transparent hover:text-white disabled:!bg-white disabled:!text-haqq-black',
    variant === 3 &&
      'text-white bg-haqq-black hover:bg-haqq-orange disabled:!bg-haqq-black',
    variant === 4 && 'text-haqq-black border border-haqq-black bg-transparent',
    'transition-color duration-150 ease-in',
    disabled && 'cursor-not-allowed',
    className,
  );

  return (
    <button
      className={classNames}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
}
