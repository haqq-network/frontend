import Select, {
  components as validatorSelectComponents,
  OptionProps,
  ClassNamesConfig,
} from 'react-select';
import clsx from 'clsx';
import { useCallback, useMemo } from 'react';

interface ValidatorSelectOption {
  label: string;
  value: string;
}

export function ValidatorSelectOption({
  children: _,
  ...rest
}: OptionProps<ValidatorSelectOption, false>) {
  return (
    <validatorSelectComponents.Option {...rest}>
      <div>{rest.data.label}</div>
      <div className="text-[10px] leading-[12px] text-white/50">
        {rest.data.value}
      </div>
    </validatorSelectComponents.Option>
  );
}

export function ValidatorSelect({
  validators,
  onChange,
}: {
  validators: Array<ValidatorSelectOption>;
  onChange: (validatorAddress?: string) => void;
}) {
  const handleFilterOption = useCallback(
    ({ label, value }: ValidatorSelectOption, inputValue: string) => {
      const inputLower = inputValue.toLowerCase();
      const labelLower = label.toLowerCase();
      const valueLower = value.toLowerCase();

      return labelLower.includes(inputLower) || valueLower.includes(inputLower);
    },
    [],
  );

  const classNames = useMemo<ClassNamesConfig<ValidatorSelectOption>>(() => {
    return {
      control: () => {
        return clsx(
          'w-full rounded-[6px] outline-none',
          'transition-colors duration-100 ease-in bg-[#E7E7E7]',
        );
      },
      container: () => {
        return '';
      },
      placeholder: () => {
        return 'text-[#0D0D0E80]';
      },
      valueContainer: () => {
        return 'text-[14px] font-[500] leading-[22px] text-[#0D0D0E] min-h-[46px] px-[16px]';
      },
      indicatorsContainer: () => {
        return 'pr-[10px] text-[#0D0D0E80]';
      },
      menu: () => {
        return clsx(
          'border-[1px] border-[#ffffff26] bg-haqq-black rounded-[6px] mt-[4px] shadow-lg',
          'text-white text-[13px] leading-[20px]',
          'overflow-hiddenz                                                                                                                                                                                                                                                                                                                                                                                         ',
        );
      },
      option: ({ isFocused, isSelected }) => {
        return clsx(
          'px-[16px] py-[10px] text-left',
          'transition-colors duration-150 ease-out',
          {
            'bg-[#ffffff14]': isFocused || isSelected,
          },
        );
      },
      noOptionsMessage: () => {
        return 'px-[16px] py-[10px]';
      },
    };
  }, []);

  return (
    <Select
      placeholder="Select new validator"
      options={validators}
      onChange={(validator) => {
        onChange(validator?.value);
      }}
      filterOption={handleFilterOption}
      components={{
        Option: ValidatorSelectOption,
      }}
      unstyled
      classNames={classNames}
      // defaultMenuIsOpen
    />
  );
}
