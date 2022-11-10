import { ReactNode } from 'react';
import clsx from 'clsx';

export function Layout({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('min-h-screen flex flex-col', className)}>
      {children}
    </div>
  );
}
