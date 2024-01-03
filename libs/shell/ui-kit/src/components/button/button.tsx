import { PropsWithChildren } from 'react';
import clsx from 'clsx';
import { SpinnerLoader } from '../spinner-loader/spinner-loader';

export type ButtonProps = PropsWithChildren<{
  className?: string;
  variant?: 1 | 2 | 3 | 4 | 5;
  disabled?: boolean;
  type?: 'submit' | 'button' | 'reset';
  isLoading?: boolean;
  onClick?: () => void;
}>;

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
    'relative rounded-[6px] h-[40px] px-[16px] md:px-[32px] py-[13px] outline-none',
    'uppercase text-[14px] font-clash leading-[14px] font-[500] tracking-[0.01em]',
    'cursor-pointer user-select-none',
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
    disabled && '!cursor-not-allowed opacity-60',
    isLoading && 'text-transparent cursor-wait',
    'transition-colors duration-150 ease-in will-change-[color,background]',
    className,
  );

  return (
    <button
      className={classNames}
      disabled={disabled || isLoading}
      onClick={onClick}
      type={type}
    >
      {isLoading ? (
        <span className="absolute left-1/2 top-1/2 !h-6 !w-6 translate-x-[-50%] translate-y-[-50%] leading-none">
          <SpinnerLoader
            className={clsx(
              '!h-[24px] !w-[24px]',
              (variant === 1 || variant === 3 || variant === 5) &&
                '!fill-white !text-white/25',
              (variant === 2 || variant === 4) &&
                '!fill-haqq-black !text-haqq-black/25',
            )}
          />
        </span>
      ) : (
        children
      )}
    </button>
  );
}
