import { ReactElement, ReactNode } from 'react';
import clsx from 'clsx';

export interface TooltipProps {
  text: string;
  children: ReactNode;
  className?: string;
}

export function Tooltip({
  text,
  children,
  className,
}: TooltipProps): ReactElement {
  return (
    <span className="relative leading-none group inline-block">
      {children}
      <div
        className={clsx(
          'invisible absolute w-max mb-1 opacity-0 scale-90',
          'left-1/2 -translate-x-1/2 -translate-y-2 bottom-full',
          'transition ease-out duration-100 delay-75',
          'group-hover:visible group-hover:z-50 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100',
          'py-[4px] px-[8px] rounded-[4px] shadow-lg leading-snug text-xs font-medium',
          'text-white bg-slate-500',
          className,
        )}
      >
        {text}
      </div>
    </span>
  );
}
