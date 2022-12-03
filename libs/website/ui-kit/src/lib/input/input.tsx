import clsx from 'clsx';

export interface InputProps {
  className?: string;
  placeholder?: string;
  type?: 'text' | 'email';
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

export function Input({
  placeholder,
  type = 'text',
  className,
  required = false,
  disabled = false,
  error,
}: InputProps) {
  const classNames = clsx(
    error
      ? 'inline-block pt-[14px] pb-[12px] px-[16px] text-[14px] text-[#FF5454] placeholder-[#FF5454] rounded-[6px] bg-[#360C0E] leading-[20px] outline-none border border-[#360C0E] focus:bg-[#360C0E] transition-color duration-150 ease-in'
      : 'inline-block pt-[14px] pb-[12px] px-[16px] text-[14px] text-white placeholder-white rounded-[6px] bg-[#252528] leading-[20px] outline-none border border-[#252528]',
    'focus:bg-transparent focus:border-white/50',
    'transition-color duration-150 ease-in',
    className,
  );

  return (
    <div className="inline relative">
      <input
        className={classNames}
        type={type}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
      />
      {required && (
        <span className="text-haqq-orange absolute right-[16px] top-0 select-none pointer-events-none">
          *
        </span>
      )}
      {error && (
        <label
          htmlFor="input"
          className="block mt-2 text-[#FF5454] text-[12px] "
        >
          Wrong {type} entered
        </label>
      )}
    </div>
  );
}
