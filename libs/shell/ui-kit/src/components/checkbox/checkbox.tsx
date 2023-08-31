import { ChangeEvent, ReactNode, useCallback } from 'react';
import clsx from 'clsx';
import styles from './checkbox.module.css';

export interface CheckboxProps {
  id?: string;
  value?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
  onChange: (value: boolean, event: ChangeEvent<HTMLInputElement>) => void;
}

export function Checkbox({
  id,
  value,
  disabled,
  children,
  className,
  onChange,
}: CheckboxProps) {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(event.target.checked, event);
      }
    },
    [onChange],
  );

  return (
    <div className={clsx(styles['checkboxContainer'], className)}>
      <label
        htmlFor={id}
        className={clsx(
          'relative inline-flex select-none flex-row items-center',
          disabled ? 'cursor-not-allowed text-white/50' : 'cursor-pointer',
        )}
      >
        <input
          id={id}
          type="checkbox"
          checked={value}
          onChange={handleChange}
          disabled={disabled}
          className={styles['checkboxInputElement']}
        />
        <svg
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles['checkboxTickBox']}
        >
          <path
            d="M4 8.14072L6.6546 11L12 5"
            strokeWidth="2"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles['checkboxTick']}
          />
        </svg>

        {children && (
          <span className="ml-[8px] text-[14px] font-[500] leading-[20px] text-white">
            {children}
          </span>
        )}
      </label>
    </div>
  );
}
