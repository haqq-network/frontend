import {
  ChangeEvent,
  InputHTMLAttributes,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import clsx from 'clsx';
import MaskedInput from 'react-text-mask';
import { createNumberMask } from 'text-mask-addons';

const DEFAULT_DECIMAL_LIMIT = 3;
const defaultMaskOptions = {
  prefix: '',
  suffix: '',
  includeThousandsSeparator: true,
  allowDecimal: true,
  decimalLimit: DEFAULT_DECIMAL_LIMIT,
  allowNegative: false,
  allowLeadingZeroes: false,
};

export const usePreparedMaskValue = (
  value: string | readonly string[] | number | undefined,
) => {
  const inputValue = useMemo(() => {
    // Hack, because react-text-mask doesn't work correctly with decimals
    // ex: it converts 0.0709 to 0.070 (not 0.071!)
    // Additionally, remove trailing zeros and only fix to decimal limit if it has decimals
    return value
      ? Number(value).toString().includes('.')
        ? Number(value).toFixed(DEFAULT_DECIMAL_LIMIT).replace(/0+$/, '')
        : value
      : undefined;
  }, [value]);

  return {
    inputValue,
  };
};

const CurrencyInput = ({
  maskOptions,
  ...inputProps
}: InputHTMLAttributes<HTMLInputElement> & {
  maskOptions?: typeof defaultMaskOptions | undefined;
}) => {
  const currencyMask: string | Array<string | RegExp> = createNumberMask({
    ...defaultMaskOptions,
    ...maskOptions,
  });

  const { inputValue } = usePreparedMaskValue(inputProps.value);
  return <MaskedInput mask={currencyMask} {...inputProps} value={inputValue} />;
};

export function StringInput({
  value,
  onChange,
  placeholder = 'Enter text',
  className,
  id,
  hint,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  hint?: ReactNode;
}) {
  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
    },
    [onChange],
  );

  return (
    <div>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={clsx(
            'w-full rounded-[6px] outline-none',
            'transition-colors duration-100 ease-in',
            'text-[#0D0D0E] placeholder:text-[#0D0D0E80]',
            'px-[16px] py-[12px] text-[14px] font-[500] leading-[22px]',
            'bg-[#E7E7E7]',
            className,
          )}
          id={id}
        />
      </div>
      {hint && <div className="mt-1 text-xs leading-[20px]">{hint}</div>}
    </div>
  );
}

export function ModalInput({
  symbol,
  value,
  onChange,
  onMaxButtonClick,
  hint,
  isMaxButtonDisabled = false,
  id,
}: {
  symbol: string;
  value: number | undefined;
  onChange: (value: string | undefined) => void;
  onMaxButtonClick?: () => void;
  hint?: ReactNode;
  isMaxButtonDisabled?: boolean;
  id?: string;
}) {
  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
    },
    [onChange],
  );

  return (
    <div>
      <div className="relative">
        <CurrencyInput
          placeholder="Enter amount"
          type="text"
          className={clsx(
            'w-full rounded-[6px] outline-none',
            'transition-colors duration-100 ease-in',
            'text-[#0D0D0E] placeholder:text-[#0D0D0E80]',
            'px-[16px] py-[12px] text-[14px] font-[500] leading-[22px]',
            'bg-[#E7E7E7]',
          )}
          onChange={handleInputChange}
          id={id}
          value={value}
        />
        {Boolean(onMaxButtonClick || symbol) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {onMaxButtonClick && (
              <button
                className="text-[14px] font-[500] leading-[22px] text-[#EC5728] disabled:text-opacity-30"
                onClick={onMaxButtonClick}
                disabled={isMaxButtonDisabled}
              >
                Max
              </button>
            )}
            {symbol && (
              <div
                className={clsx(
                  'ml-[10px] inline-block select-none text-[14px] font-[500] uppercase leading-[22px]',
                  !value ? 'text-[#0D0D0E80]' : 'text-[#0D0D0E]',
                )}
              >
                {symbol}
              </div>
            )}
          </div>
        )}
      </div>

      {hint && (
        <div className="mt-1 h-[20px] text-xs leading-[20px]">{hint}</div>
      )}
    </div>
  );
}
