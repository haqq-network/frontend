import { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './page-title.module.css';
import { Heading } from '../heading/heading';

export function PageTitle({
  className,
  title,
  subtitle,
}: {
  className?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
}) {
  return (
    <div
      className={clsx(
        styles['container'],
        'bg-haqq-black px-[16px] pb-[44px] pt-[50px] sm:px-[63px] sm:pb-[50px] sm:pt-[146px] lg:px-[79px] lg:pb-[80px] lg:pt-[160px]',
        className,
      )}
    >
      {title && <Heading level={2}>{title}</Heading>}
      {subtitle && <div className="mt-[16px]">{subtitle}</div>}
    </div>
  );
}
