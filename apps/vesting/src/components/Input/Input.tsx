import { ChangeEvent, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { Text } from '../Typography/Typography';

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
      'border-danger': state === 'error',
      'border-primary': state === 'success',
      'border-gray-400 focus:border-black': state === 'normal',
      'border-black': value && state === 'normal',
    },
    'block outline-none border border-solid ',
    'text-black text-sm',
    'w-full px-[16px] py-[10px] rounded-md',
    disabled ? 'cursor-not-allowed' : '',
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
          <Text color="light" className="mb-1 text-sm">
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
            'mt-1 text-sm font-normal leading-[18px]',
            state === 'error' ? 'text-danger' : 'text-dark-gray',
          )}
        >
          {hint}
        </div>
      )}
    </div>
  );
}
