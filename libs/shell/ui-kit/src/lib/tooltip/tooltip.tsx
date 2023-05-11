import { ReactElement } from 'react';
import clsx from 'clsx';
import { TooltipProps } from '@haqq/ui-kit';

interface ShellTooltipProps extends TooltipProps {
  address: string | undefined;
  isCopied: boolean;
}

export function Tooltip({
  text,
  children,
  className,
  address,
  isCopied,
}: ShellTooltipProps): ReactElement {
  return (
    <div className="group relative leading-none">
      {children}
      <div
        className={clsx(
          'invisible absolute mb-2 flex w-max max-w-[240px] flex-col break-words opacity-0',
          'bottom-full bg-black',
          'transition duration-100 ease-out',
          'group-hover:visible group-hover:z-50 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100',
          'rounded-[4px] p-2 pb-1 text-[12px] leading-[1.5em]',
          'border border-[#ffffff26] text-white',
          isCopied && 'left-1/3',
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
