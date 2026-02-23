'use client';

import { Tooltip } from '@haqq/shell-ui-kit';
import type { ReactNode } from 'react';

export interface StatusBadgeProps {
  label: string;
  tooltip: ReactNode;
  className: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

const TOOLTIP_CONTENT_CLASS = 'block max-w-[min(280px,90vw)]';

export function StatusBadge({
  label,
  tooltip,
  className,
  placement = 'top',
}: StatusBadgeProps) {
  const content = <span className={TOOLTIP_CONTENT_CLASS}>{tooltip}</span>;

  return (
    <Tooltip text={content} placement={placement}>
      <span
        className={`cursor-help rounded-[4px] px-[8px] py-[2px] text-[12px] font-medium ${className}`}
      >
        {label}
      </span>
    </Tooltip>
  );
}
