import clsx from 'clsx';
import { PropsWithChildren } from 'react';

export function Container({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={clsx('mx-auto px-[16px] md:px-[48px] lg:px-[80px]', className)}
    >
      {children}
    </div>
  );
}
