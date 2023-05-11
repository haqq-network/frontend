import { ReactElement, ReactNode } from 'react';
import clsx from 'clsx';

export interface TooltipProps {
  text: string;
  children: ReactNode;
}

export function Tooltip({ text, children }: TooltipProps): ReactElement {
  return (
    <span className="group relative inline-block leading-none">
      {children}
      <div
        className={clsx(
          'invisible absolute mb-1 w-max opacity-0',
          'bottom-full left-1/2 -translate-x-1/2 -translate-y-2',
          'transition duration-100 ease-out',
          'group-hover:visible group-hover:z-50 group-hover:translate-y-0 group-hover:opacity-100',
          'rounded-md px-[12px] py-[6px] text-xs font-medium leading-snug shadow-lg',
          'bg-primary text-white',
        )}
      >
        {text}
      </div>
    </span>
  );
}
