import { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './layout.module.css';

export function Layout({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('min-h-screen relative flex flex-col', className)}>
      <div
        className={clsx(
          'bg-center object-cover bg-no-repeat absolute inset-0 z-[-1] -translate-y-[50%] sm:-translate-y-[45%] xl:-translate-y-[40%] w-full',
          styles['bg-image'],
        )}
      />
      <div className="">{children}</div>
    </div>
  );
}
