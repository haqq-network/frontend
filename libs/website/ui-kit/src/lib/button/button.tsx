import clsx from 'clsx';
import { ReactNode } from 'react';
// import styles from './button.module.css';

export interface ButtonProps {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  variant?: 1 | 2 | 3 | 4;
  disabled?: boolean;
}

export function Button({
  onClick,
  className,
  variant = 1,
  disabled = true,
  children,
}: ButtonProps) {
  const classNames = clsx(
    'p-2 text-[14px] font-serif leading-[14px] font-[500] tracking-[0.01em] rounded-[6px] h-[40px] uppercase px-[32px] py-[13px] cursor-pointer',
    'transition-colors duration-100',
    variant === 1 &&
      'text-white border-white border hover:bg-white hover:text-haqq-black',
    variant === 2 &&
      'text-white border-white border hover:bg-white hover:text-haqq-black',
    variant === 3 && 'text-white bg-haqq-black hover:bg-haqq-orange',
    variant === 4 && 'text-haqq-black bg-haqq-black',
    className,
  );

  return (
    <button className={classNames} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
