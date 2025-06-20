'use client';
import { ReactNode } from 'react';
import { ModalInput } from '@haqq/shell-ui-kit';

export interface BridgeAmountInputProps {
  value: number | undefined;
  onChange: (value: string | undefined) => void;
  onMaxButtonClick: () => void;
  hint: ReactNode;
  isMaxButtonDisabled: boolean;
  tokenSymbol?: string;
}

export function BridgeAmountInput({
  value,
  onChange,
  onMaxButtonClick,
  hint,
  isMaxButtonDisabled,
  tokenSymbol = 'ETH',
}: BridgeAmountInputProps) {
  return (
    <div>
      <label className="mb-[8px] block text-[14px] font-[500] text-[#0D0D0E]">
        Amount to Bridge
      </label>
      <ModalInput
        symbol={tokenSymbol}
        value={value}
        onChange={onChange}
        onMaxButtonClick={onMaxButtonClick}
        hint={hint}
        isMaxButtonDisabled={isMaxButtonDisabled}
      />
    </div>
  );
}
