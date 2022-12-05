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
        className,
        'bg-haqq-black px-[16px] sm:px-[63px] lg:px-[79px] pt-[50px] pb-[44px] sm:pt-[146px] sm:pb-[50px] lg:pt-[160px] lg:pb-[80px]',
      )}
    >
      <Heading level={2}>{children}</Heading>
    </div>
  );
}
