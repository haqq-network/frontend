import clsx from 'clsx';
import { MagnifierIcon } from '../icons/icons';

export function SearchInput({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div className="relative">
      <MagnifierIcon className="absolute left-[16px] top-[12px] h-[24px] w-[24px] text-[#FFFFFF80]" />
      <input
        type="text"
        className={clsx(
          'w-full rounded-[6px] outline-none',
          'transition-colors duration-100 ease-in',
          'text-[#fff] placeholder:text-[#FFFFFF3D]',
          'py-[12px] pl-[48px] pr-[16px] text-[14px] font-[500] leading-[22px]',
          'bg-[#252528] hover:bg-[#3A3A3A] focus:bg-[#3A3A3A]',
          className,
        )}
        placeholder="Search by name"
        onChange={(event) => {
          onChange(event.target.value);
        }}
        value={value}
      />
    </div>
  );
}
