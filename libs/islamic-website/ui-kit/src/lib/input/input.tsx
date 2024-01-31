'use client';
import { ChangeEvent, Ref, forwardRef, useCallback, useState } from 'react';
import clsx from 'clsx';

export type InputState = 'initial' | 'success' | 'error';

export interface InputProps {
  inputClassName?: string;
  wrapperClassName?: string;
  placeholder?: string;
  type?: 'text' | 'email';
  required?: boolean;
  disabled?: boolean;
  state?: InputState;
  name?: string;
  id?: string;
  hint?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>, value?: string) => void;
}

export const Input = forwardRef(function Input(
  {
    placeholder,
    type = 'text',
    required = false,
    disabled = false,
    state = 'initial',
    inputClassName,
    wrapperClassName,
    id,
    name,
    hint,
    onChange,
  }: InputProps,
  ref: Ref<HTMLInputElement>,
) {
  const [hasValue, setHasValue] = useState(false);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      onChange(event, event.target.value);
      setHasValue(Boolean(value && value !== ''));
    },
    [onChange],
  );

  const inputClassNames = clsx(
    'inline-block w-full h-[48px] text-white placeholder-white/50 rounded-[6px] bg-transparent',
    'outline-none border',
    'focus:!text-white',
    'transition-colors duration-300 ease-out will-change-auto',
    'px-[10px] py-[14px] text-[14px] leading-[20px]',
    state === 'error'
      ? 'border-[#E16363] hover:border-[#F09C9C] focus:border-[#E16363] !text-[#E16363]'
      : 'border-[#252528] focus:border-white',
    disabled && 'cursor-not-allowed',
    hasValue && state !== 'error' && 'border-[#585858]',
    !hasValue &&
      state !== 'error' &&
      !disabled &&
      'border-[#585858] hover:border-white',
    inputClassName,
  );
  const wrapperClassNames = clsx('inline-block', wrapperClassName);

  return (
    <div className={wrapperClassNames}>
      <input
        className={inputClassNames}
        type={type}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        id={id}
        name={name}
        onChange={handleChange}
        ref={ref}
      />

      {hint && (
        <div className="relative">
          <div
            className={clsx(
              'absolute top-[4px]',
              'text-[12px] leading-[16px]',
              state === 'error' ? 'text-[#E16363]' : 'text-[#F5F5F580]',
            )}
          >
            {hint}
          </div>
        </div>
      )}
    </div>
  );
});
