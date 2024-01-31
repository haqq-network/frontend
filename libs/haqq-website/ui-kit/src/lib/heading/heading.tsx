import { ReactNode } from 'react';
import clsx from 'clsx';

export function Heading({
  level = 2,
  className,
  children,
}: {
  children: ReactNode;
  className?: string;
  level?: 1 | 2 | 3;
}) {
  if (level === 1) {
    return (
      <h1
        className={clsx(
          'font-serif text-[18px] font-[500] leading-none sm:text-[28px] lg:text-[48px] xl:text-[70px]',
          className,
        )}
      >
        {children}
      </h1>
    );
  }

  if (level === 2) {
    return (
      <h2
        className={clsx(
          'font-serif text-[18px] font-[500] leading-[1.3em] sm:text-[24px] lg:text-[32px]',
          className,
        )}
      >
        {children}
      </h2>
    );
  }

  return (
    <h3
      className={clsx(
        'font-serif text-[16px] font-[500] leading-[1.2em] sm:text-[18px] lg:text-[22px]',
        className,
      )}
    >
      {children}
    </h3>
  );
}
