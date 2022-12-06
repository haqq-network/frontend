import clsx from 'clsx';
import { ReactNode } from 'react';
// import styles from './button.module.css';

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
  disabled = true,
  children,
  type = 'button',
}: ButtonProps) {
  const classNames = clsx(
    'p-2 text-[14px] font-serif leading-[14px] font-[500] tracking-[0.01em] rounded-[6px] h-[40px] uppercase px-[32px] py-[13px] cursor-pointer',
    variant === 1 &&
      'text-white border-white border hover:bg-white hover:text-haqq-black',
    variant === 2 &&
      'text-haqq-black bg-white border-white border hover:bg-transparent hover:text-white',
    variant === 3 && 'text-white bg-haqq-black hover:bg-haqq-orange',
    variant === 4 && 'text-haqq-black bg-haqq-black',
    'transition-color duration-150 ease-in',
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
