import { PropsWithChildren } from 'react';
import clsx from 'clsx';

export function Layout({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={clsx('relative flex min-h-screen flex-col', className)}>
      {children}
    </div>
  );
}
