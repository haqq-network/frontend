'use client';
import { Button } from '@haqq/shell-ui-kit';

export interface NetworkMismatchWarningProps {
  onSwitchChain: () => void;
}

export function NetworkMismatchWarning({
  onSwitchChain,
}: NetworkMismatchWarningProps) {
  return (
    <div className="mb-[24px] rounded-[8px] bg-[#FFF3CD] p-[16px]">
      <div className="mb-[8px] text-[14px] font-medium text-[#856404]">
        Wrong Network
      </div>
      <div className="mb-[12px] text-[12px] text-[#856404]">
        Please switch to the correct network to continue
      </div>
      <Button variant={2} onClick={onSwitchChain} className="w-full">
        Switch Network
      </Button>
    </div>
  );
}
