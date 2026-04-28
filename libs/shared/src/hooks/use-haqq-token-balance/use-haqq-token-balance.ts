import { useMemo } from 'react';
import { erc20Abi, formatUnits } from 'viem';
import { haqqMainnet, haqqTestedge2 } from 'viem/chains';
import { useReadContract } from 'wagmi';

export const HAQQ_TOKEN_ADDRESSES: Record<number, `0x${string}`> = {
  [haqqTestedge2.id]: '0x3af1695e3354Ec35F892b3d0880D4f7E12F4A172',
  [haqqMainnet.id]: '0x3af1695e3354Ec35F892b3d0880D4f7E12F4A172',
};

export function getHaqqTokenAddress(
  chainId?: number,
): `0x${string}` | undefined {
  if (!chainId) {
    return undefined;
  }
  return HAQQ_TOKEN_ADDRESSES[chainId];
}

export function useHaqqTokenBalance({
  chainId,
  address,
}: {
  chainId?: number;
  address?: `0x${string}`;
}) {
  const haqqTokenAddress = getHaqqTokenAddress(chainId);
  const { data: haqqTokenBalance, refetch } = useReadContract({
    address: haqqTokenAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId,
    query: {
      enabled: Boolean(haqqTokenAddress && address),
    },
  });

  const haqqBalance = useMemo(() => {
    if (haqqTokenBalance === undefined) {
      return undefined;
    }
    return Number.parseFloat(formatUnits(haqqTokenBalance, 18));
  }, [haqqTokenBalance]);

  console.log(
    'haqqBalance',
    haqqBalance,
    haqqTokenBalance,
    haqqTokenAddress,
    address,
    chainId,
  );
  return {
    haqqTokenAddress,
    haqqTokenBalance,
    haqqBalance,
    refetch,
  };
}
