import clsx from 'clsx';
import { ReactNode } from 'react';

export function Text({
  children,
  className,
  color = 'gray',
}: {
  children: ReactNode;
  className?: string;
  color?: 'white' | 'gray';
}) {
  return (
    <div
      className={clsx(
        'uppercase',
        color === 'gray' && 'text-white/50',
        color === 'white' && 'text-white',
        className,
      )}
    >
      {children}
    </div>
  );
}
