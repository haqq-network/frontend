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
      <label className="mb-[8px] block text-[14px] font-medium text-[#0D0D0E]">
        You will receive
      </label>
      <ModalInput
        symbol={tokenSymbol}
        value={receivedAmount}
        onChange={() => {
          // Read-only input
        }}
        disabled
        className="!cursor-default !bg-[#F5F5F5] text-[#0D0D0E] placeholder-[#0D0D0E]/[.5] !opacity-100 focus:border-[#F5F5F5] focus:bg-[#F5F5F5] focus:text-[#0D0D0E] focus:placeholder-[#0D0D0E]/[.5] focus:ring-0"
      />
    </div>
  );
}
