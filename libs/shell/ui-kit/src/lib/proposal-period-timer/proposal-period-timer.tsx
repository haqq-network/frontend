import { PropsWithChildren, useMemo } from 'react';
import clsx from 'clsx';

export function ProposalPeriodTimer({
  date,
  title,
  color,
}: {
  date: Date;
  color: 'green' | 'gray' | 'red' | 'yellow' | 'blue';
  title: string;
}) {
  const { days, hours, minutes } = useMemo(() => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
    };
  }, [date]);

  return (
    <div className="flex flex-row items-center gap-[12px]">
      <div
        className={clsx({
          'text-[#0489D4]': color === 'blue',
          'text-[#01B26E]': color === 'green',
          'text-[#E3A13F]': color === 'yellow',
          'text-[#AAABB2]': color === 'gray',
          'text-[#FF5454]': color === 'red',
        })}
      >
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <circle
            cx="22"
            cy="22"
            r="21"
            stroke="white"
            strokeOpacity="0.24"
            strokeWidth="2"
            strokeDasharray="2 4"
          />
          <path
            d="M42.7716 19.6277C43.3716 19.5592 43.9163 19.9901 43.9549 20.5927C44.2202 24.7302 43.311 28.8669 41.3211 32.5211C39.1566 36.496 35.8189 39.7066 31.7629 41.7151C27.707 43.7236 23.1302 44.4323 18.6568 43.7445C14.1833 43.0567 10.0309 41.0059 6.76559 37.8718C3.50032 34.7376 1.28117 30.6726 0.410706 26.2311C-0.459755 21.7896 0.0608473 17.1877 1.90153 13.0529C3.74221 8.91803 6.81338 5.45154 10.6963 3.12605C14.2659 0.98817 18.3619 -0.0897354 22.5068 0.0058304C23.1105 0.0197487 23.5633 0.546388 23.5194 1.14863V1.14863C23.4756 1.75086 22.9516 2.20033 22.3478 2.18972C18.652 2.12478 15.0035 3.0953 11.8198 5.00201C8.32284 7.09637 5.55693 10.2183 3.8992 13.9422C2.24148 17.666 1.77262 21.8105 2.55656 25.8106C3.3405 29.8106 5.33909 33.4716 8.27981 36.2942C11.2205 39.1168 14.9603 40.9638 18.9891 41.5832C23.0179 42.2026 27.1397 41.5644 30.7925 39.7555C34.4454 37.9467 37.4514 35.0552 39.4007 31.4754C41.1754 28.2163 41.9957 24.5311 41.7794 20.841C41.7441 20.2382 42.1717 19.6962 42.7716 19.6277V19.6277Z"
            fill="currentColor"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M18 13.5H26V11.5H18V13.5ZM22 30.5C25.866 30.5 29 27.366 29 23.5C29 19.634 25.866 16.5 22 16.5C18.134 16.5 15 19.634 15 23.5C15 27.366 18.134 30.5 22 30.5ZM22 32.5C26.9706 32.5 31 28.4706 31 23.5C31 18.5294 26.9706 14.5 22 14.5C17.0294 14.5 13 18.5294 13 23.5C13 28.4706 17.0294 32.5 22 32.5ZM21 23V18H23V22.2792L26.8162 23.5513L26.1838 25.4487L21.6838 23.9487L21 23.7208V23Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="flex flex-col items-start">
        {title && (
          <div className="text-[11px] font-[500] leading-[17px] text-white/50 md:leading-[18px] lg:text-[12px]">
            {title}
          </div>
        )}
        <div className="flex flex-row gap-[8px] font-serif text-[14px] font-[500] leading-[18px] text-white/50 md:text-[16px] md:leading-[22px] lg:text-[20px] lg:leading-[26px]">
          <div>
            <span className="text-white">{days}</span> Days
          </div>
          <div>
            <span className="text-white">{hours}</span> Hours
          </div>
          <div>
            <span className="text-white">{minutes}</span> Min
          </div>
        </div>
      </div>
    </div>
  );
}

function ShowDateToggleButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-[14px] leading-[22px] text-[#EC5728] transition-colors duration-100 ease-out hover:text-[#FF8D69]"
    >
      Show all dates
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="ml-[2px] inline-block"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.85181 8.89817L6.14817 7.60181L11 12.4536L15.8518 7.60181L17.1482 8.89817L11 15.0464L4.85181 8.89817Z"
          fill="currentColor"
        />
      </svg>
    </button>
  );
}

function ProposalDatesText({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={clsx(
        'font-sans text-[10px] font-[600] uppercase leading-[1.2em] sm:text-[12px]',
        className,
      )}
    >
      {children}
    </div>
  );
}
