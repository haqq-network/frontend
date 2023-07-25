import clsx from 'clsx';
import { PropsWithChildren } from 'react';

export function Container({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={clsx(
        'mx-auto px-[40px] xl:px-[80px] 2xl:px-[350px]',
        className,
      )}
    >
      {children}
    </div>
  );
}
