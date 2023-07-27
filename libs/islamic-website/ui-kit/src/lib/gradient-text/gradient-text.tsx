import clsx from 'clsx';
import { PropsWithChildren } from 'react';

export function GradientText({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={clsx(
        'bg-gradient-to-r from-[#36FFF3] to-[#18FFAC]',
        className,
      )}
    >
      <span className="bg-clip-text text-transparent">{children}</span>
    </div>
  );
}
