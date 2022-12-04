import clsx from 'clsx';

export interface InputProps {
  inputClassName?: string;
  wrapperClassName?: string;
  placeholder?: string;
  type?: 'text' | 'email';
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

export function Input({
  placeholder,
  type = 'text',
  required = false,
  disabled = false,
  error,
  inputClassName,
  wrapperClassName,
}: InputProps) {
  const inputClassNames = clsx(
    'inline-block w-full pt-[14px] pb-[12px] px-[16px] text-[14px] text-white placeholder-white rounded-[6px] bg-[#252528] leading-[20px]',
    'outline-none border border-[#252528]',
    'focus:bg-transparent focus:border-white/50 focus:text-white',
    'transition-color duration-150 ease-in',
    error && 'text-[#FF5454] bg-[#360C0E] border-[#360C0E]',
    inputClassName,
  );
  const wrapperClassNames = clsx('inline-block', wrapperClassName);
  const requiredClassNames = clsx(
    'absolute right-[16px] top-[22px] select-none pointer-events-none',
    error ? 'text-[#FF5454]' : 'text-haqq-orange',
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
        />
        {required && <span className={requiredClassNames}>*</span>}
      </div>
      {error && (
        <div className="block mt-[8px] text-[#FF5454] text-[12px] leading-[16px]">
          {error}
        </div>
      )}
    </div>
  );
}
