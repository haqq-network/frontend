import { ChangeEvent, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { Text } from '../typography/typography';

type InputValue = string | number;

export interface InputProps {
  label?: string;
  id?: string;
  placeholder?: string;
  value?: InputValue;
  onChange?: (value: string, event?: ChangeEvent<HTMLInputElement>) => void;
  state?: 'normal' | 'success' | 'error';
  hint?: string;
  type?: 'text' | 'number';
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function Input({
  label,
  id,
  placeholder,
  value,
  onChange,
  state = 'normal',
  hint,
  type = 'text',
  required,
  disabled = false,
  className,
}: InputProps) {
  const inputId = useMemo<string | undefined>(() => {
    if (id) {
      return id;
    }

    if (label && label !== '') {
      return `input-${Math.random()}`;
    }

    return undefined;
  }, [id, label]);

  const classNames = clsx(
    {
      'border-islamic-red-500': state === 'error',
      'border-islamic-green-500': state === 'success',
      'border-islamic-black-200 focus:border-islamic-black-500 dark:border-slate-500 dark:focus:border-slate-300':
        state === 'normal',
      '!border-black dark:!border-white': value && state === 'normal',
    },
    'block outline-none border border-solid ',
    'text-black dark:text-white text-sm',
    'w-full px-4 py-3 rounded-md',
    disabled ? 'cursor-not-allowed' : '',
    className,
  );

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        const {
          target: { value },
        } = event;
        onChange(value, event);
      }
    },
    [onChange],
  );

  return (
    <div>
      {label && label !== '' && (
        <label htmlFor={inputId} className="cursor-pointer">
          <Text className="mb-1 text-sm">
            {label}
            {required && <span className="text-primary">{' *'}</span>}
          </Text>
        </label>
      )}
      <input
        disabled={disabled}
        type={type}
        id={inputId}
        className={classNames}
        placeholder={placeholder}
        required={required}
        onChange={handleInputChange}
        value={value}
      />
      {hint && hint !== '' && (
        <div
          className={clsx(
            'text-sm font-normal leading-[18px] mt-1',
            state === 'error' ? 'text-islamic-red-500' : 'text-dark-gray',
          )}
        >
          {hint}
        </div>
      )}
    </div>
  );
}
