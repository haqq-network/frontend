import { useMemo } from 'react';
import web3 from 'web3';

export function useValidateAddress(address: string): boolean {
  const isValidAddress = useMemo(() => {
    return web3.utils.isAddress(address);
  }, [address]);

  return isValidAddress;
}
