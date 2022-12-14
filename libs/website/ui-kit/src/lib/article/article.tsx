import clsx from 'clsx';
import { ReactNode } from 'react';
import styles from './article.module.css';

export interface ArticleProps {
  children: ReactNode;
  className?: string;
}

export function Article({ children, className }: ArticleProps) {
  const classNames = clsx('prose mx-auto', styles['container'], className);

  return <article className={classNames}>{children}</article>;
}
