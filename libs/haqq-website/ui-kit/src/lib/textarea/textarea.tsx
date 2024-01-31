import { ChangeEvent, Ref, forwardRef, useCallback } from 'react';
import clsx from 'clsx';

export interface TextareaProps {
  className?: string;
  wrapperClassName?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  name?: string;
  value?: string | number;
  id?: string;
  error?: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>, value?: string) => void;
}

export const Textarea = forwardRef(function Textarea(
  {
    wrapperClassName,
    className,
    placeholder,
    required,
    disabled,
    onChange,
    value,
    id,
    name,
    error,
  }: TextareaProps,
  ref: Ref<HTMLTextAreaElement>,
) {
  const textareaClassNames = clsx(
    'inline-block w-full text-white placeholder-white/25 rounded-[6px] bg-[#252528] leading-[20px]',
    'outline-none border border-[#252528]',
    'focus:bg-transparent focus:border-white/50 focus:text-white',
    'transition-colors duration-150 ease-in will-change-[color,background]',
    error && 'text-[#FF5454] bg-[#360C0E] border-[#360C0E]',
    disabled && 'cursor-not-allowed',
    'text-[14px] pt-[14px] pb-[12px] px-[16px]',
    'resize-none',
    className,
  );
  const wrapperClassNames = clsx('inline-block', wrapperClassName);
  const requiredClassNames = clsx(
    'absolute right-[16px] select-none pointer-events-none',
    error ? 'text-[#FF5454]' : 'text-haqq-orange',
    'top-[18px]',
  );

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      onChange(event, event.target.value);
    },
    [onChange],
  );

  return (
    <div className={wrapperClassNames}>
      <div className="relative">
        <textarea
          className={textareaClassNames}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          onChange={handleChange}
          id={id}
          value={value}
          ref={ref}
          name={name}
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
