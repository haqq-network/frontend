import { PropsWithChildren } from 'react';
import clsx from 'clsx';

export function Container({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={clsx(
        'mx-auto box-content max-w-[1280px] px-[16px] md:px-[48px] xl:px-[80px]',
        className,
      )}
    >
      {children}
    </div>
  );
}
