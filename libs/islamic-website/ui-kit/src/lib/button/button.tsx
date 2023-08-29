import clsx from 'clsx';
import { ButtonHTMLAttributes, PropsWithChildren } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  variant?:
    | 'islamic-classic-green'
    | 'transparent'
    | 'gradient'
    | 'primary-green';
  isLoading?: boolean;
  withArrow?: boolean;
  fill?: boolean;
}

export function Button({
  onClick,
  children,
  disabled,
  isLoading,
  variant = 'primary-green',
  className,
  withArrow,
  fill,
}: PropsWithChildren<ButtonProps>) {
  const classNames = clsx(
    'px-[32px] py-[12px] rounded-[8px] h-[48px]',
    'flex justify-center items-center gap-x-[8px]',
    'text-center uppercase text-[16px] leading-[1.5em] font-[400] font-mono',
    'transition-colors duration-300 ease-out will-change-auto group',

    variant === 'islamic-classic-green' &&
      !disabled &&
      !isLoading &&
      'bg-islamic-classic-green hover:bg-islamic-classic-green-hover text-black',

    variant === 'islamic-classic-green' &&
      'bg-islamic-classic-green text-black',

    variant === 'transparent' &&
      !disabled &&
      !isLoading &&
      'text-white bg-transparent border border-white hover:text-[#18FFAC] hover:border-[#18FFAC]',

    variant === 'transparent' && 'border border-white',

    variant === 'gradient' &&
      !disabled &&
      !isLoading &&
      'border border-[#8A8A8A] duration-300 transition-all hover:from-[#D1EDFD] hover:to-[#29FFB3]',

    variant === 'gradient' &&
      'bg-gradient-to-r from-[#B4E4FF] to-[#84FFD3] text-black',

    variant === 'primary-green' &&
      !disabled &&
      !isLoading &&
      'bg-islamic-primary-green hover:bg-islamic-primary-green-hover text-white',

    variant === 'primary-green' && isLoading && 'text-black',

    variant === 'primary-green' && disabled && 'bg-islamic-primary-green',

    isLoading && 'cursor-not-allowed',

    isLoading &&
      variant === 'transparent' &&
      'opacity-none border border-white',

    disabled && 'opacity-50 cursor-not-allowed',

    fill && 'w-full',
  );

  return (
    <button
      onClick={onClick}
      className={clsx(classNames, className)}
      disabled={disabled}
    >
      {!isLoading && <div>{children}</div>}
      {isLoading && (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="inline-flex animate-spin"
        >
          <circle cx="8" cy="8" r="7.5" stroke="#151515" strokeOpacity="0.24" />
          <path
            d="M15.5 8C15.5 9.48336 15.0601 10.9334 14.236 12.1668C13.4119 13.4001 12.2406 14.3614 10.8701 14.9291C9.49968 15.4968 7.99168 15.6453 6.53682 15.3559C5.08197 15.0665 3.74559 14.3522 2.6967 13.3033C1.64781 12.2544 0.9335 10.918 0.64411 9.46318C0.354721 8.00832 0.503246 6.50032 1.0709 5.12987C1.63856 3.75943 2.59985 2.58809 3.83322 1.76398C5.06659 0.939867 6.51664 0.5 8 0.5"
            stroke="currentColor"
          />
        </svg>
      )}

      {withArrow && !isLoading && (
        <div
          className={clsx(
            !disabled && 'duration-75 group-hover:translate-x-[4px]',
          )}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12.2559 4.41076C11.9305 4.08533 11.4029 4.08533 11.0774 4.41076C10.752 4.7362 10.752 5.26384 11.0774 5.58928L14.6548 9.16669H2.50002C2.03978 9.16669 1.66669 9.53978 1.66669 10C1.66669 10.4603 2.03978 10.8334 2.50002 10.8334H14.6548L11.0774 14.4108C10.752 14.7362 10.752 15.2638 11.0774 15.5893C11.4029 15.9147 11.9305 15.9147 12.2559 15.5893L17.2554 10.5898C17.2558 10.5894 17.2561 10.5891 17.2564 10.5888L17.8452 10L12.2559 4.41076Z"
              fill="currentColor"
            />
          </svg>
        </div>
      )}
    </button>
  );
}
