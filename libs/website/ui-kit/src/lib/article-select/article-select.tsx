import clsx from 'clsx';
import { ReactNode } from 'react';

export interface ArticleSelectProps {
  selected?: boolean;
  children: ReactNode;
  onClick: () => void;
}

export function ArticleSelect({
  selected,
  children,
  onClick,
}: ArticleSelectProps) {
  const classNames = clsx('md:flex md:items-center', !selected && 'scale-0');
  return (
    <div
      onClick={onClick}
      className="flex items-center mb-[16px] md:space-x-[20px]"
    >
      <div className={classNames}>
        <div className="w-[30px] lg:w-[48px] border border-t-[1px] border-b-0 border-l-0 border-r-0" />
        <div className="w-[17px] h-[16px] bg-black" />
      </div>

      <div className="ml-[20px]">{children}</div>
    </div>
  );
}
