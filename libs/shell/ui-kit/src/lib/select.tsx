'use client';
import { useCallback, useMemo } from 'react';
import clsx from 'clsx';
import ReactSelect, {
  components as selectComponents,
  OptionProps,
  ClassNamesConfig,
  OptionsOrGroups,
  GroupBase,
} from 'react-select';

interface SelectOption {
  label: string | undefined;
  value: string;
}

export function SelectOption({
  children: _,
  ...rest
}: OptionProps<SelectOption, false>) {
  return (
    <selectComponents.Option {...rest}>
      <div className="m-4">{rest.data.label}</div>
    </selectComponents.Option>
  );
}

export function Select({
  options,
  placeholder,
  className,
  selectContainerClassName,
  label,
  id,
  defaultValue,
  onChange,
}: {
  options: OptionsOrGroups<SelectOption, GroupBase<SelectOption>>;
  defaultValue?: SelectOption;
  placeholder?: string;
  selectContainerClassName?: string;
  className?: string;
  label?: string;
  id?: string;
  onChange: (option?: string) => void;
}) {
  const formatGroupLabel = useCallback((data: GroupBase<SelectOption>) => {
    return (
      <div className="px-[16px] py-[6px] text-left text-[10px] font-[500] uppercase leading-[18px] text-white/50">
        {data.label}
      </div>
    );
  }, []);

  const classNames = useMemo<ClassNamesConfig<SelectOption>>(() => {
    return {
      control: () => {
        return clsx(
          'inline-block w-full rounded-[6px] border border-[#252528] bg-transparent outline-none',
          'transition-colors duration-150 ease-in will-change-[color,background]',
          'focus:border-white/50 focus:bg-transparent focus:text-white',
          'hover:border-white/20',
        );
      },
      container: () => {
        return clsx(selectContainerClassName);
      },
      placeholder: () => {
        return 'text-white/25';
      },
      valueContainer: () => {
        return 'text-white text-[14px] font-[500] leading-[22px] min-h-[46px] px-[16px]';
      },
      indicatorsContainer: () => {
        return 'pr-[10px] text-white/25';
      },
      menu: () => {
        return clsx(
          'border-[1px] border-haqq-border bg-haqq-black rounded-[6px] mt-[4px] shadow-lg',
          'text-white text-[13px] leading-[20px]',
          'overflow-hidden',
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
  }, [selectContainerClassName]);

  return (
    <div className={clsx('flex flex-col gap-[8px]', className)}>
      {label && (
        <div>
          <label
            htmlFor={id}
            className="cursor-pointer text-[12px] font-[500] uppercase leading-[24px] text-white/50"
          >
            {label}
          </label>
        </div>
      )}
      <ReactSelect
        id={id}
        placeholder={placeholder}
        options={options}
        onChange={(validator) => {
          onChange(validator?.value);
        }}
        components={{
          Option: SelectOption,
        }}
        unstyled
        classNames={classNames}
        isSearchable={false}
        formatGroupLabel={formatGroupLabel}
        menuPlacement="auto"
        defaultValue={defaultValue}
      />
    </div>
  );
}
