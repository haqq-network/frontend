import { PropsWithChildren, ReactElement, ReactNode } from 'react';
import clsx from 'clsx';

export interface TooltipProps {
  text: ReactNode;
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
          'invisible absolute w-max max-w-[400px] scale-90 text-center opacity-0',
          'bottom-full left-1/2 -translate-x-1/2 -translate-y-2',
          'pointer-events-none select-none transition delay-75 duration-100 ease-out',
          'z-50 group-hover:visible group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100',
          'rounded-[4px] p-[8px]  font-sans text-[12px] font-[500] leading-[18px] shadow-sm',
          'bg-haqq-black mb-[4px] transform-gpu border border-[#FFFFFF26] bg-opacity-90 text-white backdrop-blur',
          className,
        )}
      >
        {text}
      </div>
    </span>
  );
}
