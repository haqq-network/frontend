'use client';

import { Button } from '@haqq/shell-ui-kit';
import { useSwitchChain } from 'wagmi';
import { WAITLIST_DEFAULT_CHAIN_ID } from '../constants/waitlist-config';

export interface NetworkWarningProps {
  onSwitchChain?: () => void;
}

export function NetworkWarning({ onSwitchChain }: NetworkWarningProps) {
  const { switchChainAsync } = useSwitchChain();

  const handleSwitch = async () => {
    if (onSwitchChain) {
      onSwitchChain();
    } else {
      try {
        await switchChainAsync({ chainId: WAITLIST_DEFAULT_CHAIN_ID });
      } catch (error) {
        console.error('Failed to switch chain:', error);
      }
    }
  };

  return (
    <div className="mb-[24px] rounded-[8px] bg-[#FEF3C7] p-[16px]">
      <div className="mb-[12px] text-[14px] font-[500] text-[#92400E]">
        Please switch to HAQQ Testedge2 network to participate
      </div>
      <Button variant={2} onClick={handleSwitch}>
        Switch Network
      </Button>
    </div>
  );
}
