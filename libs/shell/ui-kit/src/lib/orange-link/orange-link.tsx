import clsx from 'clsx';
import { PropsWithChildren } from 'react';

export function OrangeLink({
  children,
  className,
}: PropsWithChildren<{
  className?: string;
}>) {
  return (
    <span
      className={clsx(
        'text-[14px] font-[600] leading-[1.2em] text-[#EC5728] hover:text-[#FF8D69]',
        'cursor-pointer transition-colors duration-100 ease-out',
        className,
      )}
    >
      {children}
    </span>
  );
}
