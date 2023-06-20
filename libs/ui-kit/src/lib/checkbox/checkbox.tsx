import { ChangeEvent, ReactNode, useCallback } from 'react';
import clsx from 'clsx';
import { Text } from '../typography/typography';
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
    <div
      className={clsx(styles['checkboxContainer'], 'leading-none', className)}
    >
      <label
        htmlFor={id}
        className={clsx(
          'relative inline-flex select-none flex-row items-center',
          disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
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
          <Text block className="pl-[12px]">
            {children}
          </Text>
        )}
      </label>
    </div>
  );
}
