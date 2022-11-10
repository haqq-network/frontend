import { ReactElement, ReactNode } from 'react';
import clsx from 'clsx';

export interface TooltipProps {
  text: string;
  children: ReactNode;
}

export function Tooltip({ text, children }: TooltipProps): ReactElement {
  return (
    <span className="relative leading-none group inline-block">
      {children}
      <div
        className={clsx(
          'invisible absolute w-max mb-1 opacity-0 scale-90',
          'left-1/2 -translate-x-1/2 -translate-y-2 bottom-full',
          'transition ease-out duration-100',
          'group-hover:visible group-hover:z-50 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100',
          'py-[6px] px-[12px] rounded-md shadow-lg leading-snug text-xs font-medium',
          'text-white bg-islamic-green-500',
        )}
      >
        {text}
      </div>
    </span>
  );
}
