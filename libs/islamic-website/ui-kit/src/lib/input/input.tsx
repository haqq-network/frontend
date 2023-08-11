import clsx from 'clsx';
import { ChangeEvent, Ref, forwardRef, useCallback } from 'react';

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
  value?: string | number;
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
    value,
  }: InputProps,
  ref: Ref<HTMLInputElement>,
) {
  const inputClassNames = clsx(
    'inline-block w-full text-white placeholder-white/50 rounded-[6px] bg-transparent',
    'outline-none border border-[#252528]',
    'focus:border-islamic-primary-green focus:text-white',
    'transition-colors duration-300 ease-in will-change-[color]',
    'px-[10px] py-[14px] text-[14px] leading-[20px]',
    error &&
      'border-[#E16363] !text-[#E16363] focus:border-[#E16363] focus:text-[#E16363] invalid:focus:border-[#E16363]',
    disabled && 'cursor-not-allowed',
    inputClassName,
  );
  const wrapperClassNames = clsx('inline-block', wrapperClassName);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange(event, event.target.value);
    },
    [onChange],
  );

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
        value={value}
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
