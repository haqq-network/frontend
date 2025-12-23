import {
  ChangeEvent,
  InputHTMLAttributes,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import { useTranslate } from '@tolgee/react';
import clsx from 'clsx';
import MaskedInput from 'react-text-mask';
import { createNumberMask } from 'text-mask-addons';

const DEFAULT_DECIMAL_LIMIT = 6;
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
    if (!value && value !== 0) return undefined;

    // Convert to string, preserving precision
    let stringValue: string;
    if (typeof value === 'number') {
      // Use toFixed with high precision to avoid scientific notation
      // This preserves values like 0.0001 without rounding
      stringValue = value.toFixed(18);
    } else if (Array.isArray(value)) {
      stringValue = value.join('');
    } else {
      stringValue = String(value);
    }

    // Remove trailing zeros for cleaner display, but preserve the decimal point if needed
    // This allows values like 0.0001 to be displayed correctly
    const cleaned = stringValue.replace(/\.?0+$/, '');
    // If cleaning removed everything (e.g., value was 0), return "0"
    return cleaned || '0';
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
  placeholder,
  className,
  id,
  hint,
  readOnly = false,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  hint?: ReactNode;
  readOnly?: boolean;
}) {
  const { t } = useTranslate('common');
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
          placeholder={placeholder ?? t('enter-text', 'Enter text')}
          className={clsx(
            'w-full rounded-[6px] outline-none',
            'transition-colors duration-100 ease-in',
            'text-[#0D0D0E] placeholder:text-[#0D0D0E80]',
            'px-[16px] py-[12px] text-[14px] font-[500] leading-[22px]',
            'bg-[#E7E7E7]',
            className,
          )}
          id={id}
          readOnly={readOnly}
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
  const { t } = useTranslate('common');
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
          placeholder={t('enter-amount', 'Enter Amount')}
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
          <div className="absolute end-3 top-1/2 -translate-y-1/2">
            {onMaxButtonClick && (
              <button
                className="text-[14px] font-[500] leading-[22px] text-[#EC5728] disabled:text-opacity-30"
                onClick={onMaxButtonClick}
                disabled={isMaxButtonDisabled}
              >
                {t('max', 'Max')}
              </button>
            )}
            {symbol && (
              <div
                className={clsx(
                  'ms-[10px] inline-block select-none text-[14px] font-[500] uppercase leading-[22px]',
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
