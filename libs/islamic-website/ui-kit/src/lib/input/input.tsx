'use client';
import clsx from 'clsx';
import { ChangeEvent, Ref, forwardRef, useCallback, useState } from 'react';

export interface InputProps {
  inputClassName?: string;
  wrapperClassName?: string;
  placeholder?: string;
  type?: 'text' | 'email';
  required?: boolean;
  disabled?: boolean;
  error?: string;
  name?: string;
  id?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>, value?: string) => void;
}

export const Input = forwardRef(function Input(
  {
    placeholder,
    type = 'text',
    required = false,
    disabled = false,
    error,
    inputClassName,
    wrapperClassName,
    id,
    name,
    onChange,
  }: InputProps,
  ref: Ref<HTMLInputElement>,
) {
  const [inputValue, setInputValue] = useState('');

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
      onChange(event, event.target.value);
    },
    [onChange],
  );

  const inputClassNames = clsx(
    'inline-block w-full h-[48px] text-white placeholder-white/50 rounded-[6px] bg-transparent',
    'outline-none border',
    'focus:!text-white',
    'transition-colors duration-300 ease-out will-change-auto',
    'px-[10px] py-[14px] text-[14px] leading-[20px]',
    error
      ? 'border-[#E16363] hover:border-[#F09C9C] focus:border-[#E16363] !text-[#E16363]'
      : 'border-[#252528] focus:border-white',
    disabled && 'cursor-not-allowed',
    inputValue && !error && 'border-[#585858]',
    !inputValue && !error && !disabled && 'border-[#585858] hover:border-white',
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
        value={inputValue}
        ref={ref}
      />

      {error && (
        <div className="mt-[4px] text-[12px] leading-[16px] text-[#E16363]">
          {error}
        </div>
      )}
    </div>
  );
});
