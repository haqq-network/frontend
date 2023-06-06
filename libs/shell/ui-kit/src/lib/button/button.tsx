import clsx from 'clsx';
import { ReactNode } from 'react';
import { SpinnerLoader } from '../spinner-loader/spinner-loader';

export interface ButtonProps {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  variant?: 1 | 2 | 3 | 4 | 5;
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
    'relative text-[14px] font-serif leading-[14px] font-[500] tracking-[0.01em] rounded-[6px] h-[40px] uppercase px-[32px] py-[13px] cursor-pointer user-select-none',
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
    variant === 5 &&
      (isLoading
        ? 'bg-[#01B26E]'
        : 'text-haqq-black bg-[#01B26E] disabled:bg-[#01B26E80] disabled:cursor-not-allowed hover:bg-[#2CE69E]'),
    'transition-color duration-150 ease-in will-change-[color,background]',
    disabled && '!cursor-not-allowed opacity-60',
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
        <div className="absolute left-1/2 top-1/2 !h-6 !w-6 translate-x-[-50%] translate-y-[-50%] leading-none">
          <SpinnerLoader
            className={clsx(
              '!h-6 !w-6',
              (variant === 1 || variant === 3) && '!fill-white !text-white/25',
              (variant === 2 || variant === 4) &&
                '!fill-haqq-black !text-haqq-black/25',
            )}
          />
        </div>
      )}
    </button>
  );
}
