import clsx from 'clsx';

export interface TransactionDetailsProps {
  title: string;
  value: string | number | undefined;
  className?: string;
  titleClassName?: string;
  valueClassName?: string;
}

export function TransactionDetails({
  title,
  value,
  className,
  titleClassName,
  valueClassName,
}: TransactionDetailsProps) {
  return (
    <div className={clsx('flex justify-between', className)}>
      <div
        className={clsx(
          'text-slate-700 dark:text-slate-200 leading-8 text-base',
          titleClassName,
        )}
      >
        {title}
      </div>
      <div className={clsx('font-medium leading-8 text-lg', valueClassName)}>
        {value}
      </div>
    </div>
  );
}

export default TransactionDetails;
