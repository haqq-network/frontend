import clsx from 'clsx';
import { ReactNode } from 'react';

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'mx-auto w-full',
        'px-[16px] sm:px-[48px] lg:px-[79px]',
        className,
      )}
    >
      {children}
    </div>
  );
}
