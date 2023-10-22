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
  autoFocus?: boolean;
  value?: string | number;
  onChange: (event: ChangeEvent<HTMLInputElement>, value?: string) => void;
  size?: 'normal' | 'small';
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
    autoFocus,
    size = 'normal',
  }: InputProps,
  ref: Ref<HTMLInputElement>,
) {
  const inputClassNames = clsx(
    'inline-block w-full text-white placeholder-white/25 rounded-[6px] bg-[#252528] leading-[20px]',
    'outline-none border border-[#252528]',
    'focus:bg-transparent focus:border-white/50 focus:text-white',
    'transition-colors duration-150 ease-in will-change-[color,background]',
    error && 'text-[#FF5454] bg-[#360C0E] border-[#360C0E]',
    disabled && 'cursor-not-allowed',
    size === 'normal' && 'text-[14px] pt-[14px] pb-[12px] px-[16px]',
    size === 'small' && 'text-[13px] pt-[10px] pb-[8px] px-[14px]',
    inputClassName,
  );
  const wrapperClassNames = clsx('inline-block', wrapperClassName);
  const requiredClassNames = clsx(
    'absolute right-[16px] select-none pointer-events-none h-[24px] leading-[24px]',
    error ? 'text-[#FF5454]' : 'text-haqq-orange',
    size === 'normal' && 'top-[16px]',
    size === 'small' && 'top-[12px]',
  );

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange(event, event.target.value);
    },
    [onChange],
  );

  return (
    <div className={wrapperClassNames}>
      <div className="relative">
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
          autoFocus={autoFocus}
        />
        {required && <span className={requiredClassNames}>*</span>}
      </div>
      {error && (
        <div className="mt-[8px] block text-[12px] leading-[16px] text-[#FF5454]">
          {error}
        </div>
      )}
    </div>
  );
});
