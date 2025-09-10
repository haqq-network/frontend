'use client';

import { useReadContract } from 'wagmi';
import { erc20Abi, parseUnits } from 'viem';
import { useMemo } from 'react';

interface UseTokenAllowanceParams {
  tokenAddress?: string;
  ownerAddress?: string;
  spenderAddress?: string;
  bridgeAmount?: number;
  tokenDecimals?: number;
}

interface UseTokenAllowanceReturn {
  allowance: bigint | undefined;
  isLoading: boolean;
  error: Error | null;
  needsApproval: boolean;
  refetch: () => void;
}

const ETH_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

/**
 * Hook to check ERC-20 token allowance and determine if approval is needed
 */
export function useTokenAllowance({
  tokenAddress,
  ownerAddress,
  spenderAddress,
  bridgeAmount,
  tokenDecimals = 18,
}: UseTokenAllowanceParams): UseTokenAllowanceReturn {
  const isEthToken = tokenAddress === ETH_ADDRESS;
  
  const {
    data: allowance,
    isLoading,
    error,
    refetch,
  } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [ownerAddress as `0x${string}`, spenderAddress as `0x${string}`],
    query: {
      enabled: Boolean(
        !isEthToken && ownerAddress && spenderAddress && tokenAddress
      ),
    },
  });

  const needsApproval = useMemo(() => {
    // ETH doesn't need approval
    if (isEthToken) {
      return false;
    }

    // No amount specified
    if (!bridgeAmount) {
      return false;
    }

    // Parse the bridge amount to wei
    const amountWei = parseUnits(bridgeAmount.toString(), tokenDecimals);

    // If allowance is not available or insufficient
    return !allowance || allowance < amountWei;
  }, [isEthToken, bridgeAmount, allowance, tokenDecimals]);

  return {
    allowance,
    isLoading,
    error,
    needsApproval,
    refetch,
  };
}
