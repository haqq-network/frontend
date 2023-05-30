import { PropsWithChildren } from 'react';
import clsx from 'clsx';

export function BlogTabs({
  tabs,
  current,
  className,
  onChange,
  isDark = false,
}: {
  tabs: string[];
  current: string;
  className?: string;
  onChange: (id: string) => void;
  isDark?: boolean;
}) {
  return (
    <div
      className={clsx(
        'border-[#FFFFFF26] flex w-full items-start border-b-[1px]',
        className,
      )}
    >
      {tabs.map((tab, index) => {
        return (
          <BlogTab
            key={`${index}-${tab}`}
            isActive={current === tab}
            onClick={() => {
              onChange(tab);
            }}
          >
            {tab}
          </BlogTab>
        );
      })}
    </div>
  );
}

function BlogTab({
  children,
  onClick,
  className,
  isActive = false,
}: PropsWithChildren<{
  className?: string;
  isActive?: boolean;
  onClick: () => void;
}>) {
  return (
    <div
      className={clsx(
        'px-[16px] py-[12px]',
        'font-sans text-[12px] leading-[1.5em] md:text-[13px] md:leading-[22px] lg:text-[14px] font-[500]',
        'cursor-pointer transition-colors duration-150',
        'md:mb-[-1px]',
        isActive
          ? 'border-white text-white border-b-[2px] font-[600]'
          : 'text-[#868686] border-[transparent] border-b-[1px]',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
