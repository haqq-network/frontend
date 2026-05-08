import { useMemo } from 'react';
import { Hex } from 'viem';
import { useAccount } from 'wagmi';
import { ethToHaqq } from '../../utils/convert-address';

export function useAddress() {
  const { address: ethAddress } = useAccount();
  // const ethAddress = '0xbe4Cc5565A43E34489D2f02eD9680B436E596383' as Hex;
  const haqqAddress = useMemo(() => {
    if (ethAddress) {
      return ethToHaqq(ethAddress);
    }

    return undefined;
  }, [ethAddress]);

  return {
    ethAddress,
    haqqAddress,
  };
}
