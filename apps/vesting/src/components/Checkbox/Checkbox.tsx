import { ChangeEvent, ReactNode, useCallback } from 'react';
import clsx from 'clsx';
import { Text } from '../Typography/Typography';
import styles from './Checkbox.module.css';
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
  const checkboxClasses = clsx('leading-none', className);
  const labelClassNames = clsx(
    'relative select-none inline-flex flex-row items-center',
    disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
  );

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(event.target.checked, event);
      }
    },
    [onChange],
  );

  return (
    <div className={clsx(styles['checkboxContainer'], checkboxClasses)}>
      <label htmlFor={id} className={labelClassNames}>
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
            className={styles['checkboxTick']}
            d="M4 8.14072L6.6546 11L12 5"
            strokeWidth="2"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {children ? (
          <Text block className="pl-[12px]">
            {children}
          </Text>
        ) : null}
      </label>
    </div>
  );
}
