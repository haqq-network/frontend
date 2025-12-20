'use client';

import { useCallback, useMemo } from 'react';
import { useTranslate } from '@tolgee/react';
import clsx from 'clsx';
import Select, {
  components as tokenSelectComponents,
  OptionProps,
  ClassNamesConfig,
} from 'react-select';

interface Token {
  symbol: string;
  address: string;
  name?: string;
  balance?: string;
  decimals?: number;
  formattedBalance?: number;
}

interface TokenSelectOption {
  label: string;
  value: string;
  token: Token;
}

interface TokenSelectorProps {
  tokens: Token[];
  selectedToken: Token | null;
  onTokenSelect: (token: Token) => void;
  disabled?: boolean;
}

const NATIVE_ETH_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

const isNativeToken = (address: string): boolean => {
  return address.toLowerCase() === NATIVE_ETH_ADDRESS.toLowerCase();
};

export function TokenSelectOption({
  children: _,
  ...rest
}: OptionProps<TokenSelectOption, false>) {
  const { token } = rest.data;
  const balanceText = useMemo(() => {
    return token.formattedBalance !== undefined
      ? ` - ${token.formattedBalance.toFixed(6)}`
      : '';
  }, [token.formattedBalance]);

  const displayAddress = useMemo(() => {
    return isNativeToken(token.address) ? 'native' : token.address;
  }, [token.address]);

  return (
    <tokenSelectComponents.Option {...rest}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[14px] font-[500] text-[#0D0D0E]">
            {token.symbol} {token.name && `(${token.name})`}
          </div>
          <div className="text-[10px] leading-[12px] text-[#0D0D0E80]">
            {displayAddress}
          </div>
        </div>
        {balanceText && (
          <div className="text-[12px] text-[#0D0D0E80]">
            {token.formattedBalance?.toFixed(6)}
          </div>
        )}
      </div>
    </tokenSelectComponents.Option>
  );
}

const components = {
  Option: TokenSelectOption,
};

export function TokenSelector({
  tokens,
  selectedToken,
  onTokenSelect,
  disabled = false,
}: TokenSelectorProps) {
  const { t } = useTranslate('bridge');

  const handleFilterOption = useCallback((option: any, inputValue: string) => {
    const { label, value, token } = option.data;
    const inputLower = inputValue.toLowerCase();
    const labelLower = label.toLowerCase();
    const valueLower = value.toLowerCase();

    // Check if it matches label or address
    const matchesLabelOrAddress =
      labelLower.includes(inputLower) || valueLower.includes(inputLower);

    // If searching for "native" and token is native ETH, include it
    if (inputLower === 'native' && isNativeToken(token.address)) {
      return true;
    }

    return matchesLabelOrAddress;
  }, []);

  const classNames = useMemo<ClassNamesConfig<TokenSelectOption>>(() => {
    return {
      control: () => {
        return clsx(
          'w-full rounded-[12px] border border-[#E8E8E8] bg-white',
          'transition-colors duration-100 ease-in',
          'focus-within:border-[#04D484] focus-within:outline-none',
          {
            'opacity-50 cursor-not-allowed': disabled,
          },
        );
      },
      container: () => {
        return '';
      },
      placeholder: () => {
        return 'text-[#0D0D0E80]';
      },
      valueContainer: () => {
        return 'text-[16px] font-[500] text-[#0D0D0E] min-h-[54px] px-[16px] py-[18px]';
      },
      indicatorsContainer: () => {
        return 'pe-[16px] text-[#0D0D0E80]';
      },
      menu: () => {
        return clsx(
          'border-[1px] border-[#E8E8E8] bg-white rounded-[12px] mt-[4px] shadow-lg',
          'text-[#0D0D0E] text-[14px] leading-[20px]',
          'overflow-hidden',
        );
      },
      option: ({ isFocused, isSelected }) => {
        return clsx(
          'px-[16px] py-[12px] text-start',
          'transition-colors duration-150 ease-out',
          {
            'bg-[#04D48410]': isFocused || isSelected,
          },
        );
      },
      noOptionsMessage: () => {
        return 'px-[16px] py-[12px] text-[#0D0D0E80]';
      },
    };
  }, [disabled]);

  const options = useMemo(() => {
    return tokens
      .filter((token) => {
        return token.address;
      })
      .map((token) => {
        return {
          label: `${token.symbol}${token.name ? ` (${token.name})` : ''}`,
          value: token.address.toLowerCase(),
          token,
        };
      });
  }, [tokens]);

  const selectedOption = useMemo(() => {
    if (!selectedToken) return null;
    return (
      options.find((option) => {
        return option.value === selectedToken.address.toLowerCase();
      }) || null
    );
  }, [selectedToken, options]);

  const onChange = useCallback(
    (option: any) => {
      if (option) {
        onTokenSelect(option.token);
      }
    },
    [onTokenSelect],
  );

  return (
    <div className="space-y-[8px]">
      <label className="block text-[14px] font-[500] text-[#0D0D0E]">
        {t('select-token', 'Select Token')}
      </label>
      <Select
        placeholder={t('select-a-token', 'Select a token')}
        options={options}
        value={selectedOption}
        onChange={onChange}
        filterOption={handleFilterOption}
        components={components}
        isDisabled={disabled}
        unstyled
        classNames={classNames}
      />

      {tokens.length > 0 && (
        <div className="!mt-0 h-[20px] text-xs leading-[20px] text-[#0D0D0E80]">
          Loaded {tokens.length} token{tokens.length !== 1 ? 's' : ''} from your
          wallet
        </div>
      )}
    </div>
  );
}
