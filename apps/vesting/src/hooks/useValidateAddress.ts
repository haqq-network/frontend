import { useMemo } from 'react';
import { isAddress } from 'viem';

export function useValidateAddress(address: string): boolean {
  const isValidAddress = useMemo(() => {
    return isAddress(address);
  }, [address]);

  return isValidAddress;
}
