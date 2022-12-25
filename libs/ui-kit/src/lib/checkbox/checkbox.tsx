import { ChangeEvent, ReactNode, useCallback } from 'react';
import clsx from 'clsx';
import styled from '@emotion/styled';
import { Text } from '../typography/typography';

export interface CheckboxProps {
  id?: string;
  value?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
  onChange: (value: boolean, event: ChangeEvent<HTMLInputElement>) => void;
}

const CheckboxContainer = styled.div`
  --checkbox-border-width: 1.5px;
  --checkbox-border-radius: 4px;
  --checkbox-size: 20px;
  --checkbox-color: var(--haqq-color-stroke);
`;

const CheckboxTickBox = styled.svg`
  flex: 0 0 auto;
  width: var(--checkbox-size);
  height: var(--checkbox-size);
  border-radius: var(--checkbox-border-radius);
  box-sizing: border-box;
  border: var(--checkbox-border-width) solid var(--checkbox-color);
  outline: none;
`;

const CheckboxTick = styled.path`
  color: #fff;
  stroke-dasharray: 20;
  stroke-dashoffset: 20;
  transition: stroke-dashoffset calc(var(--haqq-transition-duration) * 3) ease;
`;

const CheckboxInputElement = styled.input`
  position: absolute;
  left: -9999px;
  opacity: 0;

  /* Checked */
  &:checked + ${CheckboxTickBox} {
    border-color: var(--haqq-color-green) !important;
    background-color: var(--haqq-color-green);

    & ${CheckboxTick} {
      stroke-dashoffset: 0;
    }
  }

  /* Focus */
  &:not(&:disabled)&:hover + ${CheckboxTickBox} {
    --checkbox-color: var(--haqq-color-black);
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
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(event.target.checked, event);
      }
    },
    [onChange],
  );

  return (
    <CheckboxContainer className={clsx('leading-none', className)}>
      <label
        htmlFor={id}
        className={clsx(
          'relative select-none inline-flex flex-row items-center cursor-pointer',
          'disabled:opacity-60 disabled:cursor-not-allowed',
        )}
      >
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

        {children && (
          <Text block className="pl-[12px]">
            {children}
          </Text>
        )}
      </label>
    </CheckboxContainer>
  );
}
