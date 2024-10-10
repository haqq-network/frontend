'use client';

import { useCallback, useState } from 'react';
import { usePostHog } from 'posthog-js/react';
import { parseEther } from 'viem';
import { useWriteContract } from 'wagmi';
import { useAccount, useChains } from 'wagmi';
import {
  DEFAULT_STRIDE_ADDRESS,
  STRIDE_LIQUID_STAKING_CONTRACT_ADDRESS_MAINNET,
} from '../../liquid-staking-constants';
import { trackBroadcastTx } from '../../utils/track-broadcast-tx';
import { useAddress } from '../use-address/use-address';
import stridLiquidStakingABI from './../../abis/stride-liquid-staking.abi.json';

export function useLiquidStakingDelegate() {
  const posthog = usePostHog();

  const { writeContractAsync: liquidStakeISLM } = useWriteContract();

  const { haqqAddress } = useAddress();

  const [strideAddress, setStrideAddress] = useState<string>('');

  const chains = useChains();

  const { chain = chains[0] } = useAccount();
  const chainId = chain.id;

  const handleDelegate = useCallback(
    async (debouncedDelegateAmount: number) => {
      try {
        if (!haqqAddress) {
          throw new Error('Stride address not found');
        }

        const amount = parseEther(
          debouncedDelegateAmount.toString(),
        ).toString();

        const broadcastPromise = async () => {
          const tx = await liquidStakeISLM({
            address: STRIDE_LIQUID_STAKING_CONTRACT_ADDRESS_MAINNET,
            abi: stridLiquidStakingABI,
            functionName: 'liquidStakeISLM',
            args: [
              amount.toString(),
              strideAddress || DEFAULT_STRIDE_ADDRESS,
              haqqAddress,
            ],
          });

          return {
            txhash: tx,
          } as any;
        };

        const txResponse = await trackBroadcastTx(
          broadcastPromise(),
          chainId,
          posthog,
        );

        return txResponse;
      } catch (error) {
        console.error('Delegation failed:', error);
        posthog?.capture('delegate_failed', {
          error: (error as Error).message,
        });
      }
    },
    [liquidStakeISLM, posthog, strideAddress, haqqAddress, chainId],
  );

  return {
    delegate: handleDelegate,
    setStrideAddress,
    strideAddress,
  };
}

export function useLiquidStakingUndelegate() {
  const posthog = usePostHog();

  const { writeContractAsync: redeemStISLM } = useWriteContract();

  const { haqqAddress } = useAddress();

  const [strideAddress, setStrideAddress] = useState<string>('');

  const chains = useChains();

  const { chain = chains[0] } = useAccount();
  const chainId = chain.id;

  const handleUndelegate = useCallback(
    async (amount: number) => {
      try {
        if (!strideAddress || !haqqAddress) {
          throw new Error('Stride address not found');
        }

        const broadcastPromise = async () => {
          const tx = await redeemStISLM({
            address: STRIDE_LIQUID_STAKING_CONTRACT_ADDRESS_MAINNET,
            abi: stridLiquidStakingABI,
            functionName: 'redeemStISLM',
            args: [
              parseEther(amount.toString()).toString(),
              strideAddress || DEFAULT_STRIDE_ADDRESS,
              haqqAddress,
            ],
          });

          return {
            txhash: tx,
          } as any;
        };

        const txResponse = await trackBroadcastTx(
          broadcastPromise(),
          chainId,
          posthog,
        );

        return txResponse;
      } catch (error) {
        console.error('Undelegation failed:', error);
        posthog?.capture('undelegate_failed', {
          //chainId: chain?.id,
          error: (error as Error).message,
        });
      }
    },
    [redeemStISLM, posthog, strideAddress, haqqAddress, chainId],
  );

  return {
    undelegate: handleUndelegate,
    setStrideAddress,
    strideAddress,
  };
}
