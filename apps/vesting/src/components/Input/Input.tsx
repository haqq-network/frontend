import { ChangeEvent, InputHTMLAttributes, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import MaskedInput from 'react-text-mask';
import { createNumberMask } from 'text-mask-addons';
import { Text } from '../typography';

const defaultMaskOptions = {
  prefix: '',
  suffix: '',
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: ',',
  allowDecimal: true,
  decimalSymbol: '.',
  decimalLimit: 4,
  allowNegative: false,
  allowLeadingZeroes: false,
  // integerLimit: 7,
};

type InputValue = string | number;

export interface InputProps {
  label?: string;
  id?: string;
  placeholder?: string;
  value?: InputValue;
  onChange: (value: string | undefined) => void;
  state?: 'normal' | 'success' | 'error';
  hint?: string;
  required?: boolean;
  disabled?: boolean;
}

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

export function Input({
  label,
  id,
  placeholder,
  value,
  onChange,
  state = 'normal',
  hint,
  required,
  disabled = false,
}: InputProps) {
  const inputId = useMemo<string | undefined>(() => {
    if (id) {
      return id;
    }

    if (label && label !== '') {
      return `input-${Math.random()}`;
    }

    return undefined;
  }, [id, label]);

  const classNames = clsx(
    {
      'border-danger': state === 'error',
      'border-primary': state === 'success',
      'border-gray-400 focus:border-black': state === 'normal',
      'border-black': value && state === 'normal',
    },
    'block outline-none border border-solid ',
    'text-black text-sm',
    'w-full px-[16px] py-[10px] rounded-md',
    disabled ? 'cursor-not-allowed' : '',
  );

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
    },
    [onChange],
  );

  return (
    <div>
      {label && label !== '' && (
        <label htmlFor={inputId} className="cursor-pointer">
          <Text color="light" className="mb-1 text-sm">
            {label}
            {required && <span className="text-primary">{' *'}</span>}
          </Text>
        </label>
      )}

      <CurrencyInput
        disabled={disabled}
        id={inputId}
        className={classNames}
        placeholder={placeholder}
        required={required}
        type="text"
        onChange={handleInputChange}
        value={value}
      />

      {hint && hint !== '' && (
        <div
          className={clsx(
            'mt-1 text-sm font-normal leading-[18px]',
            state === 'error' ? 'text-danger' : 'text-dark-gray',
          )}
        >
          {hint}
        </div>
      )}
    </div>
  );
}
