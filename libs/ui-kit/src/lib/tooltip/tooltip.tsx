import { PropsWithChildren, ReactElement } from 'react';
import clsx from 'clsx';

export interface TooltipProps {
  text: string;
  className?: string;
}

export function Tooltip({
  text,
  children,
  className,
}: PropsWithChildren<TooltipProps>): ReactElement {
  return (
    <span className="group relative inline-block leading-none">
      {children}
      <div
        className={clsx(
          'invisible absolute mb-1 w-max scale-90 opacity-0',
          'bottom-full left-1/2 -translate-x-1/2 -translate-y-2',
          'transition delay-75 duration-100 ease-out',
          'group-hover:visible group-hover:z-50 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100',
          'rounded-[4px] px-[8px] py-[4px] text-xs font-medium leading-snug shadow-lg',
          'bg-slate-500 text-white',
          className,
        )}
      >
        {text}
      </div>
    </span>
  );
}
