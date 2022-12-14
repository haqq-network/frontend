import clsx from 'clsx';
import { ReactNode } from 'react';
import { SpinnerLoader } from '../loader/loader';

export interface ButtonProps {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  variant?: 1 | 2 | 3 | 4;
  disabled?: boolean;
  type?: 'submit' | 'button' | 'reset';
  isLoading?: boolean;
}

export function Button({
  onClick,
  className,
  variant = 1,
  disabled = false,
  children,
  type = 'button',
  isLoading,
}: ButtonProps) {
  const classNames = clsx(
    'relative p-2 text-[14px] font-serif leading-[14px] font-[500] tracking-[0.01em] rounded-[6px] h-[40px] uppercase px-[32px] py-[13px] cursor-pointer user-select-none',
    variant === 1 &&
      (isLoading
        ? 'border border-white'
        : 'text-white border-white border hover:bg-white hover:text-haqq-black disabled:!text-white disabled:!bg-transparent'),
    variant === 2 &&
      (isLoading
        ? 'border border-white bg-white'
        : 'text-haqq-black bg-white border-white border hover:bg-transparent hover:text-white disabled:!bg-white disabled:!text-haqq-black'),
    variant === 3 &&
      (isLoading
        ? 'border border-white/25 bg-haqq-black'
        : 'text-white bg-haqq-black hover:bg-haqq-orange disabled:!bg-haqq-black'),
    variant === 4 &&
      (isLoading
        ? 'border border-haqq-black bg-transparent'
        : 'text-haqq-black border border-haqq-black bg-transparent'),
    'transition-color duration-150 ease-in',
    disabled && 'cursor-not-allowed',
    isLoading && 'text-transparent cursor-wait',
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
      {isLoading && (
        <SpinnerLoader
          className={clsx(
            'absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] leading-none',
            variant === 1 && 'fill-white text-white/25',
            variant === 2 && 'fill-haqq-black text-haqq-black/25',
            variant === 3 && 'fill-white text-white/25',
            variant === 4 && 'fill-haqq-black text-haqq-black/25',
          )}
        />
      )}
    </button>
  );
}
