'use client';

import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from 'wagmi';
import { LiquidVestingAbi } from '../abi/liquid-vesting';
import { LIQUID_VESTING_PRECOMPILE_ADDRESS } from '../constants/liquid-vesting-config';

/**
 * Hook to call liquidate(liquidateFrom, liquidateTo, amount) on the LiquidVesting precompile.
 * Creates liquid tokens from vesting balance.
 * Returns mintedAmount and erc20Contract address.
 */
export function useLiquidVestingLiquidate() {
  const { chain } = useAccount();
  const chainId = chain?.id;

  const {
    writeContractAsync,
    data: hash,
    isPending,
    error,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
    chainId,
  });

  const liquidate = async (
    liquidateFrom: `0x${string}`,
    liquidateTo: `0x${string}`,
    amount: bigint,
  ) => {
    if (!writeContractAsync) {
      throw new Error('Wallet not connected');
    }

    if (!chainId) {
      throw new Error('Chain ID not available');
    }

    return writeContractAsync({
      address: LIQUID_VESTING_PRECOMPILE_ADDRESS,
      abi: LiquidVestingAbi,
      functionName: 'liquidate',
      args: [liquidateFrom, liquidateTo, amount],
      chainId,
    });
  };

  return {
    liquidate,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook to call redeem(redeemFrom, redeemTo, denom, amount) on the LiquidVesting precompile.
 * Burns liquid tokens and redeems the underlying vesting tokens.
 */
export function useLiquidVestingRedeem() {
  const { chain } = useAccount();
  const chainId = chain?.id;

  const {
    writeContractAsync,
    data: hash,
    isPending,
    error,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
    chainId,
  });

  const redeem = async (
    redeemFrom: `0x${string}`,
    redeemTo: `0x${string}`,
    denom: string,
    amount: bigint,
  ) => {
    if (!writeContractAsync) {
      throw new Error('Wallet not connected');
    }

    if (!chainId) {
      throw new Error('Chain ID not available');
    }

    return writeContractAsync({
      address: LIQUID_VESTING_PRECOMPILE_ADDRESS,
      abi: LiquidVestingAbi,
      functionName: 'redeem',
      args: [redeemFrom, redeemTo, denom, amount],
      chainId,
    });
  };

  return {
    redeem,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}
