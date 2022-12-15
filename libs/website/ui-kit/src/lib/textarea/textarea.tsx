import clsx from 'clsx';
import { ChangeEvent, forwardRef, useCallback } from 'react';

export interface TextareaProps {
  className?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  name?: string;
  value?: string | number;
  id?: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>, value?: string) => void;
}

export const Textarea = forwardRef(function Textarea(
  {
    className,
    placeholder,
    required,
    disabled,
    onChange,
    value,
    id,
    name,
  }: TextareaProps,
  ref: any,
) {
  const classNames = clsx(
    'inline-block pt-[14px] pb-[12px] px-[16px] text-[14px] text-white placeholder-white/25 leading-[20px]',
    'rounded-[6px] bg-[#252528] outline-none border border-[#252528] resize-none',
    'focus:bg-transparent focus:border-white/50',
    'transition-color duration-150 ease-in',
    className,
  );
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      onChange(event, event.target.value);
    },
    [onChange],
  );

  return (
    <textarea
      className={classNames}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      onChange={handleChange}
      id={id}
      value={value}
      ref={ref}
      name={name}
    />
  );
});
