import clsx from 'clsx';

export interface InputProps {
  className?: string;
  placeholder?: string;
  type?: 'text' | 'email';
  required?: boolean;
  disabled?: boolean;
}

export function Input({
  placeholder,
  type = 'text',
  className,
  required = false,
  disabled = false,
}: InputProps) {
  const classNames = clsx(
    'inline-block pt-[14px] pb-[12px] px-[16px] text-[14px] text-white placeholder-white rounded-[6px] bg-[#252528] leading-[20px] outline-none border border-[#252528]',
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
    </div>
  );
}
