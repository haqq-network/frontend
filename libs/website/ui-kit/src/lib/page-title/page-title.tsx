import clsx from 'clsx';
import { ReactNode } from 'react';
import { Heading } from '../heading/heading';
import styles from './page-title.module.css';

interface PageTitleProps {
  className?: string;
  children: ReactNode;
}

export function PageTitle({ className, children }: PageTitleProps) {
  return (
    <div
      className={clsx(
        styles['container'],
        'bg-haqq-black px-[16px] pb-[44px] pt-[50px] sm:px-[63px] sm:pb-[50px] sm:pt-[146px] lg:px-[79px] lg:pb-[80px] lg:pt-[160px]',
        className,
      )}
    >
      <Heading level={2}>{children}</Heading>
    </div>
  );
}
