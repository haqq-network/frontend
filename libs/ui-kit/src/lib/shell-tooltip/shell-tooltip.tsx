import { ReactElement } from 'react';
import clsx from 'clsx';
import { TooltipProps } from '../tooltip/tooltip';

interface ShellTooltipProps extends TooltipProps {
  address: string | undefined;
  isCopied: boolean;
}

export function ShellTooltip({
  text,
  children,
  className,
  address,
  isCopied,
}: ShellTooltipProps): ReactElement {
  return (
    <div className="relative leading-none group">
      {children}
      <div
        className={clsx(
          'flex flex-col invisible absolute w-max mb-2 opacity-0 max-w-[240px] break-words',
          'bottom-full',
          'transition ease-out duration-100 delay-75',
          'group-hover:visible group-hover:z-50 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100',
          'p-2 rounded-[4px] text-[12px] leading-[1.5em]',
          'text-white border border-[#ffffff26]',
          isCopied ? 'left-1/3' : '-left-1/3',
          className,
        )}
      >
        {isCopied ? (
          <span>{text}</span>
        ) : (
          <div className="flex flex-col">
            <span>{text}</span>
            <span>{address}</span>
          </div>
        )}
      </div>
    </div>
  );
}
