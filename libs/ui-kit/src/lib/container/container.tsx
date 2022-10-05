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
        'w-full lg:container px-4 sm:px-6 lg:px-8 mx-auto',
        className,
      )}
    >
      {children}
    </div>
  );
}
