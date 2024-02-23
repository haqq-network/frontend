import {
  ChangeEvent,
  InputHTMLAttributes,
  ReactNode,
  useCallback,
} from 'react';
import clsx from 'clsx';
import MaskedInput from 'react-text-mask';
import { createNumberMask } from 'text-mask-addons';

const defaultMaskOptions = {
  prefix: '',
  suffix: '',
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: ',',
  allowDecimal: true,
  decimalSymbol: '.',
  decimalLimit: 3,
  allowNegative: false,
  allowLeadingZeroes: false,
  // integerLimit: 7,
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

  return <MaskedInput mask={currencyMask} {...inputProps} />;
};

export function ModalInput({
  symbol,
  value,
  onChange,
  onMaxButtonClick,
  hint,

  isMaxButtonDisabled = false,
}: {
  symbol: string;
  value: number | undefined;
  onChange: (value: string | undefined) => void;
  onMaxButtonClick: () => void;
  hint?: ReactNode;
  isMaxButtonDisabled?: boolean;
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
          id="amount"
          value={value}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <button
            className="text-[14px] font-[500] leading-[22px] text-[#EC5728] disabled:text-opacity-30"
            onClick={onMaxButtonClick}
            disabled={isMaxButtonDisabled}
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
