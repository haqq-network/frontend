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
    <div className={clsx('min-h-screen relative flex flex-col', className)}>
      <div className=''>{children}</div>
    </div>
  );
}
