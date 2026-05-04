'use client';
import { useMemo } from 'react';
import { formatUnits } from 'viem';
import { useBalance } from 'wagmi';
import { useAddress } from '@haqq/shell-shared';
import { stISLM_MAINNET } from '../constants';

export function useStislmBalance() {
  const { ethAddress } = useAddress();

  const balanceInStIslm = useBalance({
    token: stISLM_MAINNET,
    address: ethAddress,
  });

  return useMemo(() => {
    return Number(formatUnits(balanceInStIslm.data?.value ?? 0n, 18));
  }, [balanceInStIslm.data?.value]);
}
