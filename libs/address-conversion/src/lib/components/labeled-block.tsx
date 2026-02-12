import { ReactNode } from 'react';
import clsx from 'clsx';

export function LabeledBlock({
  title,
  value,
  className,
}: {
  title: string;
  value: string | ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('flex flex-col gap-y-[6px]', className)}>
      <div className="font-guise text-[10px] font-semibold uppercase leading-[14px] text-white/50 lg:text-[12px]">
        {title}
      </div>
      <div
        className={clsx(
          'font-guise text-[18px] font-medium leading-[28px] text-white',
        )}
      >
        {value}
      </div>
    </div>
  );
}
