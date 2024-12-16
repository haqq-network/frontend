import { useMemo } from 'react';
import { Hex } from 'viem';
import { useAccount } from 'wagmi';
import { ethToHaqq } from '../../utils/convert-address';

export function useAddress() {
  //const { address: ethAddress } = useAccount();
  const ethAddress = '0x912A3b8cF600CbDD71ffC4224e80501221482346' as Hex;
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
