import clsx from 'clsx';
import { PropsWithChildren } from 'react';

export function FilterButton({
  children,
  active,
  onClick,
}: PropsWithChildren<{
  active: boolean;
  onClick: () => void;
}>) {
  return (
    <div
      className={clsx(
        'rtl:font-handjet ltr:font-vcr cursor-pointer rounded-[8px] px-[12px] py-[8px] text-[14px] font-[400] uppercase leading-[20px] text-white transition-colors duration-300',
        active
          ? 'bg-islamic-primary-green'
          : 'hover:bg-islamic-primary-green/50 bg-transparent',
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
