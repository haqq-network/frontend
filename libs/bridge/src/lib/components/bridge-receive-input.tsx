'use client';
import { StringInput } from '@haqq/shell-ui-kit';

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
      <StringInput
        value={receivedAmount ? `${receivedAmount} ${tokenSymbol}` : ''}
        onChange={() => {
          // Read-only input
        }}
        placeholder={`0 ${tokenSymbol}`}
        className="!bg-[#F5F5F5] !text-[#0D0D0E80]"
      />
    </div>
  );
}
