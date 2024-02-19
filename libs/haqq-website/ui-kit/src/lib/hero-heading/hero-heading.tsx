import { ReactNode } from 'react';
import clsx from 'clsx';

export function HeroHeading({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const classNames = clsx(
    'font-clash font-[500] leading-none uppercase',
    'text-[46px] sm:text-[80px] lg:text-[140px]',
    className,
  );

  return <h1 className={classNames}>{children}</h1>;
}
