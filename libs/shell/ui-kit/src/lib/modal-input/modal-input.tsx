import { ChangeEvent, ReactNode, useCallback, useEffect } from 'react';
import clsx from 'clsx';

export function ModalInput({
  symbol,
  value,
  onChange,
  onMaxButtonClick,
  hint,
  step = 0.001,
}: {
  symbol: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  onMaxButtonClick: () => void;
  hint?: ReactNode;
  step?: number;
}) {
  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange(Number.parseFloat(event.target.value));
    },
    [onChange],
  );

  useEffect(() => {
    return () => {
      onChange(undefined);
    };
  }, [onChange]);

  return (
    <div>
      <div className="relative">
        <input
          type="number"
          id="amount"
          value={value}
          className={clsx(
            'w-full rounded-md px-4 py-2 outline-none',
            'transition-colors duration-100 ease-in',
            'text-[#0D0D0E] placeholder:text-[#0D0D0E80]',
            'px-[16px] py-[12px] text-[14px] font-[500] leading-[22px]',
            'bg-[#E7E7E7]',
          )}
          placeholder="Enter amount"
          onChange={handleInputChange}
          step={step}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <button
            className="text-[14px] font-[500] leading-[22px] text-[#EC5728]"
            onClick={onMaxButtonClick}
          >
            Max
          </button>
          <div
            className={clsx(
              'ml-[10px] inline-block select-none text-[14px] font-[500] uppercase leading-[22px]',
              !value ? 'text-[#0D0D0E80]' : 'text-[#0D0D0E]',
            )}
          >
            {symbol}
          </div>
        </div>
      </div>

      {hint && (
        <div className="mt-1 h-[20px] text-xs leading-[20px]">{hint}</div>
      )}
    </div>
  );
}
