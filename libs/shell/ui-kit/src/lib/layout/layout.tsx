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
    <div
      className={clsx(
        'relative flex min-h-screen flex-col',
        styles['bg-image'],
        className,
      )}
    >
      {children}
    </div>
  );
}
