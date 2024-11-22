import { ReactNode } from 'react';
import clsx from 'clsx';

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
        'px-[16px] sm:px-[48px] lg:px-[80px]',
        className,
      )}
    >
      {children}
    </div>
  );
}
