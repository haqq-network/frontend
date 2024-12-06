import { useCallback, useState } from 'react';
import clsx from 'clsx';
import { ArrowDownIcon } from './icons';

export const ExpandableBlock = ({
  title,
  content,
}: {
  title: React.ReactNode;
  content: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  return (
    <>
      <div onClick={toggle}>
        <div
          className={clsx(
            'font-guise inline-flex cursor-help flex-row items-center justify-center gap-[8px]',
            'text-white',
            'text-[12px] font-[500] leading-[18px]',
            'transition-colors duration-150 ease-in-out',
          )}
        >
          <div className="flex flex-row items-center gap-[4px]">{title}</div>

          {isOpen ? (
            <div className="inline-flex flex-row items-center justify-center gap-[4px]">
              <div className="text-[12px] font-[500] leading-[14px]">
                Less info
              </div>
              <ArrowDownIcon className="rotate-180 transition-transform duration-200" />
            </div>
          ) : (
            <div className="inline-flex flex-row items-center justify-center gap-[4px]">
              <div className="text-[12px] font-[500] leading-[14px]">
                More info
              </div>
              <ArrowDownIcon className="transition-transform duration-200" />
            </div>
          )}
        </div>
      </div>

      <div
        className={clsx(
          'transition-all duration-200 ease-in-out',
          'origin-top',
          isOpen ? 'h-auto opacity-100' : 'pointer-events-none h-0 opacity-0',
        )}
      >
        {content}
      </div>
    </>
  );
};
