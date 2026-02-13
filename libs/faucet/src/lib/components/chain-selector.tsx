'use client';

import { useCallback, useMemo } from 'react';
import { useTranslate } from '@tolgee/react';
import clsx from 'clsx';
import Select, {
  components as chainSelectComponents,
  OptionProps,
  ClassNamesConfig,
} from 'react-select';
import { Chain } from 'viem/chains';

interface ChainSelectOption {
  label: string;
  value: number;
  chain: Chain;
}

interface ChainSelectorProps {
  chains: Chain[];
  selectedChain: Chain | undefined;
  onChainSelect: (chain: Chain) => void;
  disabled?: boolean;
}

export function ChainSelectOption({
  children: _,
  ...rest
}: OptionProps<ChainSelectOption, false>) {
  const { chain } = rest.data;

  return (
    <chainSelectComponents.Option {...rest}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[14px] font-medium text-white">{chain.name}</div>
          <div className="text-[10px] leading-[12px] text-white/50">
            Chain ID: {chain.id}
          </div>
        </div>
      </div>
    </chainSelectComponents.Option>
  );
}

const components = {
  Option: ChainSelectOption,
};

export function ChainSelector({
  chains,
  selectedChain,
  onChainSelect,
  disabled = false,
}: ChainSelectorProps) {
  const { t } = useTranslate('faucet');

  const handleFilterOption = useCallback((option: any, inputValue: string) => {
    const { label } = option.data;
    const inputLower = inputValue.toLowerCase();
    const labelLower = label.toLowerCase();

    return labelLower.includes(inputLower);
  }, []);

  const classNames = useMemo<ClassNamesConfig<ChainSelectOption>>(() => {
    return {
      control: () => {
        return clsx(
          'w-full rounded-[12px] border border-white/20 bg-white/5',
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
        return 'text-white/50';
      },
      valueContainer: () => {
        return 'text-[16px] font-medium text-white min-h-[54px] px-[16px] py-[18px]';
      },
      indicatorsContainer: () => {
        return 'pe-[16px] text-white/50';
      },
      menu: () => {
        return clsx(
          'border border-white/20 bg-[#0D0D0E] rounded-[12px] mt-[4px] shadow-lg',
          'text-white text-[14px] leading-[20px]',
          'overflow-hidden',
        );
      },
      option: ({ isFocused, isSelected }) => {
        return clsx(
          'px-[16px] py-[12px] text-start',
          'transition-colors duration-150 ease-out',
          {
            'bg-[#04D48420]': isFocused || isSelected,
          },
        );
      },
      noOptionsMessage: () => {
        return 'px-[16px] py-[12px] text-white/50';
      },
    };
  }, [disabled]);

  const options = useMemo(() => {
    return chains.map((chain) => {
      return {
        label: chain.name,
        value: chain.id,
        chain,
      };
    });
  }, [chains]);

  const selectedOption = useMemo(() => {
    if (!selectedChain) return null;
    return (
      options.find((option) => {
        return option.value === selectedChain.id;
      }) || null
    );
  }, [selectedChain, options]);

  const onChange = useCallback(
    (option: any) => {
      if (option) {
        onChainSelect(option.chain);
      }
    },
    [onChainSelect],
  );

  return (
    <div className="space-y-[8px]">
      <label className="block text-[14px] font-medium text-white">
        {t('select-chain', 'Select Chain')}
      </label>
      <Select
        placeholder={t('select-a-chain', 'Select a chain')}
        options={options}
        value={selectedOption}
        onChange={onChange}
        filterOption={handleFilterOption}
        components={components}
        isDisabled={disabled}
        unstyled
        classNames={classNames}
      />
    </div>
  );
}
