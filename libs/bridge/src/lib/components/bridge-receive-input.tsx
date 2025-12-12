'use client';
import { ModalInput, StringInput } from '@haqq/shell-ui-kit';

export interface BridgeReceiveInputProps {
  receivedAmount: number | undefined;
  tokenSymbol: string;
}

export function BridgeReceiveInput({
  receivedAmount,
  tokenSymbol,
}: BridgeReceiveInputProps) {
  return (
    <div>
      <label className="mb-[8px] block text-[14px] font-[500] text-[#0D0D0E]">
        You will receive
      </label>
      <ModalInput
        symbol={tokenSymbol}
        value={receivedAmount}
        onChange={() => {
          // Read-only input
        }}
      />
    </div>
  );
}
