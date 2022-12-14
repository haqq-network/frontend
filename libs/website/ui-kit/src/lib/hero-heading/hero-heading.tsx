import clsx from 'clsx';
import { ReactNode } from 'react';

export function HeroHeading({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const classNames = clsx(
    'font-serif font-[500] leading-none uppercase',
    'text-[46px] sm:text-[80px] lg:text-[140px]',
    className,
  );

  return <h1 className={classNames}>{children}</h1>;
}
