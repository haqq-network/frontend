import { ReactElement, ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  withShadow?: boolean;
}

export function Card({
  children,
  className,
  withShadow = false,
}: CardProps): ReactElement {
  return (
    <div
      className={clsx(
        'rounded-[12px] bg-white shadow-sm transition-shadow duration-100 ease-in hover:shadow-lg hover:shadow-green-800/10',
        className,
      )}
      style={
        withShadow ? { boxShadow: '0px 8px 24px rgba(15, 30, 51, 0.08)' } : {}
      }
    >
      {children}
    </div>
  );
}
