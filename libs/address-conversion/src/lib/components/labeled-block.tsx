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
      <div className="font-guise text-[10px] leading-[14px] font-semibold text-white/50 uppercase lg:text-[12px]">
        {title}
      </div>
      <div
        className={clsx(
          'font-guise text-[18px] leading-[28px] font-medium text-white',
        )}
      >
        {value}
      </div>
    </div>
  );
}
