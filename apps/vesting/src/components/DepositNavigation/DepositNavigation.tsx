import { useCallback } from 'react';
import clsx from 'clsx';
import { Text } from '../Typography/Typography';

interface DepositNavigation {
  current: number;
  total: number;
  className?: string;
  onChange: (nextPage: number) => void;
}

export function DepositNavigation({
  current,
  total,
  className,
  onChange,
}: DepositNavigation) {
  const handlePrevClick = useCallback(() => {
    onChange(current - 1);
  }, [current, onChange]);
  const handleNextClick = useCallback(() => {
    onChange(current + 1);
  }, [current, onChange]);

  return (
    <div
      className={clsx('flex flex-row items-center justify-center', className)}
    >
      <button
        onClick={handlePrevClick}
        disabled={current <= 1}
        className="h-6 w-6 hover:text-primary cursor-pointer p-1 disabled:cursor-not-allowed disabled:text-gray-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <div>
        <Text color="light" className="text-lg">
          {current} of {total}
        </Text>
      </div>
      <button
        onClick={handleNextClick}
        disabled={current >= total}
        className="h-6 w-6 hover:text-primary cursor-pointer p-1 disabled:cursor-not-allowed disabled:text-gray-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
