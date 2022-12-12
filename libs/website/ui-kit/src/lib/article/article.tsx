import clsx from 'clsx';
import { ReactNode } from 'react';
import styles from './article.module.css';

export interface ArticleProps {
  children: ReactNode;
  className?: string;
}

export function Article({ children, className }: ArticleProps) {
  const classNames = clsx(
    'prose max-w-[50ch] lg:max-w-[80ch] m-auto',
    'prose-p:text-[13px] prose-p:md:text-[15px] prose-p:lg:text-base',
    'prose-a:text-haqq-orange prose-a:no-underline prose-a:cursor-default',
    'prose-h1:font-serif prose-h1:font-medium prose-h1:leading-[130%] prose-h1:text-[18px] prose-h1:md:text-[24px] prose-h1:lg:text-[32px] prose-h1:mb-[20px] prose-h1:md:mb-[24px] prose-h1:mt-[48xp] prose-h1:md:mt-[64px]',
    styles['container'],
    className,
  );

  return <article className={classNames}>{children}</article>;
}
