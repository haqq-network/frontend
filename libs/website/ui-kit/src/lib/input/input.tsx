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
    'inline-block pt-[14px] pb-[12px] px-[16px] rounded-[6px] leading-[20px] outline-none border',
    'focus:border-white/50',
    'transition-color duration-150 ease-in',
    className,
    error
      ? 'text-[#FF5454] placeholder-[#FF5454] bg-[#360C0E] border-[#360C0E] focus:bg-[#360C0E] focus:bg-[#360C0E]'
      : 'text-white placeholder-white bg-[#252528] border-[#252528] focus:bg-transparent',
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
        <div className="block mt-2 text-[#FF5454] text-[12px] ">
          Wrong {type} entered
        </div>
      )}
    </div>
  );
}
