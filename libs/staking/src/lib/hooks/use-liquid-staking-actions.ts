'use client';
import { useCallback, useState } from 'react';
import { usePostHog } from 'posthog-js/react';
import { parseEther } from 'viem';
import { useWriteContract } from 'wagmi';
import { useAccount, useChains } from 'wagmi';
import { BroadcastTxResponse } from '@haqq/data-access-cosmos';
import { useAddress, trackBroadcastTx } from '@haqq/shell-shared';
import stridLiquidStakingABI from '../abi/stride-liquid-staking.abi.json';
import {
  DEFAULT_STRIDE_ADDRESS,
  STRIDE_LIQUID_STAKING_CONTRACT_ADDRESS_MAINNET,
} from '../constants';

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
        if (!strideAddress) {
          throw new Error('Stride address not found');
        }

        if (!haqqAddress) {
          throw new Error('Haqq address not found');
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
          } as BroadcastTxResponse;
        };

        const txResponse = await trackBroadcastTx(
          broadcastPromise(),
          chainId,
          posthog,
        );

        return txResponse;
      } catch (error) {
        console.error('Delegation failed:', error);
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
        if (!strideAddress) {
          throw new Error('Stride address not found');
        }

        if (!haqqAddress) {
          throw new Error('Haqq address not found');
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
          } as BroadcastTxResponse;
        };

        const txResponse = await trackBroadcastTx(
          broadcastPromise(),
          chainId,
          posthog,
        );

        return txResponse;
      } catch (error) {
        console.error('Undelegation failed:', error);
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
