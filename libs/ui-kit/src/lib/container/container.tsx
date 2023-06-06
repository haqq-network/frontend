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
        'mx-auto w-full px-4 lg:container sm:px-6 lg:px-8',
        className,
      )}
    >
      {children}
    </div>
  );
}
