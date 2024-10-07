'use client';

import { useCallback, useMemo } from 'react';
import { usePostHog } from 'posthog-js/react';
import { parseEther } from 'viem';
import { useWriteContract } from 'wagmi';
import { STRIDE_LIQUID_STAKING_CONTRACT_ADDRESS_MAINNET } from '../../contracts';
import { ethToStride } from '../../utils/convert-address';
import { useAddress } from '../use-address/use-address';
import stridLiquidStakingABI from './../../abis/stride-liquid-staking-stride.json';

export function useLiquidStakingActions() {
  const posthog = usePostHog();

  const { writeContractAsync: liquidStakeISLM } = useWriteContract();

  const { writeContractAsync: redeemStISLM } = useWriteContract();

  const { haqqAddress, ethAddress } = useAddress();

  const strideAddress = useMemo(() => {
    if (ethAddress) {
      return ethToStride(ethAddress);
    }

    return undefined;
  }, [ethAddress]);

  const handleDelegate = useCallback(
    async (amount: number) => {
      try {
        if (!strideAddress || !haqqAddress) {
          throw new Error('Stride address not found');
        }

        const tx = await liquidStakeISLM({
          address: STRIDE_LIQUID_STAKING_CONTRACT_ADDRESS_MAINNET,
          abi: stridLiquidStakingABI,
          functionName: 'liquidStakeISLM',
          args: [parseEther(amount.toString()), strideAddress, haqqAddress],
        });

        console.log('Delegation transaction:', tx);

        return {
          txHash: tx,
        };
        // use trackBroadcastTx
        //posthog?.capture('delegate', { chainId: chain?.id, amount });
      } catch (error) {
        console.error('Delegation failed:', error);
        posthog?.capture('delegate_failed', {
          // chainId: chain?.id,
          error: (error as Error).message,
        });
      }
    },
    [liquidStakeISLM, posthog, strideAddress, haqqAddress],
  );

  const handleUndelegate = useCallback(
    async (amount: number) => {
      try {
        if (!strideAddress || !haqqAddress) {
          throw new Error('Stride address not found');
        }

        const tx = await redeemStISLM({
          address: STRIDE_LIQUID_STAKING_CONTRACT_ADDRESS_MAINNET,
          abi: stridLiquidStakingABI,
          functionName: 'redeemStISLM',
          args: [parseEther(amount.toString()), strideAddress, haqqAddress],
        });
        console.log('Undelegation transaction:', tx);
        //posthog?.capture('undelegate', { chainId: chain?.id, amount });

        return {
          txHash: tx,
        };
      } catch (error) {
        console.error('Undelegation failed:', error);
        posthog?.capture('undelegate_failed', {
          //chainId: chain?.id,
          error: (error as Error).message,
        });
      }
    },
    [redeemStISLM, posthog, strideAddress, haqqAddress],
  );

  return {
    delegate: handleDelegate,
    undelegate: handleUndelegate,
  };
}
