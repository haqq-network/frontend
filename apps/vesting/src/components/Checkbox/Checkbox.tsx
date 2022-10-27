import  { ChangeEvent, ReactNode, useCallback } from 'react';
import clsx from 'clsx';
import { Text } from '../Typography/Typography';
import styled from '@emotion/styled';

export interface CheckboxProps {
  id?: string;
  value?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
  onChange: (value: boolean, event: ChangeEvent<HTMLInputElement>) => void;
}

const CheckboxContainer = styled.div`
  --ui-kit-checkbox-border-width: 1px;
  --ui-kit-checkbox-border-radius: 4px;
  --ui-kit-checkbox-size: 24px;
  --ui-kit-checkbox-color: var(--ui-kit-color-stroke);
`;

const CheckboxTickBox = styled.svg`
  flex: 0 0 auto;
  width: var(--ui-kit-checkbox-size);
  height: var(--ui-kit-checkbox-size);
  border-radius: var(--ui-kit-checkbox-border-radius);
  box-sizing: border-box;
  border: var(--ui-kit-checkbox-border-width) solid var(--ui-kit-checkbox-color);
  outline: none;
`;

const CheckboxTick = styled.path`
  color: #fff;
  stroke-dasharray: 20;
  stroke-dashoffset: 20;
  transition: stroke-dashoffset calc(var(--ui-kit-transition-duration) * 3) ease;
`;

const CheckboxInputElement = styled.input`
  position: absolute;
  left: -9999px;
  opacity: 0;

  /* Checked */
  &:checked + ${CheckboxTickBox} {
    border-color: var(--ui-kit-color-primary) !important;
    background-color: var(--ui-kit-color-primary);

    & ${CheckboxTick} {
      stroke-dashoffset: 0;
    }
  }

  /* Focus */
  &:not(&:disabled)&:hover + ${CheckboxTickBox} {
    --ui-kit-checkbox-color: var(--color-black);
  }
`;

export function Checkbox({
  id,
  value,
  disabled,
  children,
  className,
  onChange,
}: CheckboxProps) {
  const checkboxClasses = clsx('leading-none', className);
  const labelClassNames = clsx(
    'relative select-none inline-flex flex-row items-center',
    disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
  );

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(event.target.checked, event);
      }
    },
    [onChange],
  );

  return (
    <CheckboxContainer className={checkboxClasses}>
      <label htmlFor={id} className={labelClassNames}>
        <CheckboxInputElement
          id={id}
          type="checkbox"
          checked={value}
          onChange={handleChange}
          disabled={disabled}
        />
        <CheckboxTickBox
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <CheckboxTick
            d="M4 8.14072L6.6546 11L12 5"
            strokeWidth="2"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </CheckboxTickBox>

        {children ? (
          <Text block className="pl-[12px]">
            {children}
          </Text>
        ) : null}
      </label>
    </CheckboxContainer>
  );
}
