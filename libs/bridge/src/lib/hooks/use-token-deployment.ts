'use client';

import { useCallback, useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ERC20FactoryAbi } from '../abi/erc20-factory';

interface UseTokenDeploymentParams {
  factoryAddress?: string;
  targetChainId?: number;
}

interface UseTokenDeploymentReturn {
  deployToken: (
    localTokenAddress: string,
    name: string,
    symbol: string,
  ) => Promise<string>;
  isDeploying: boolean;
  deploymentHash: string | null;
  deployedTokenAddress: string | null;
  error: string | null;
  reset: () => void;
}

/**
 * Hook to deploy remote tokens using OptimismMintableERC20Factory
 */
export function useTokenDeployment({
  factoryAddress,
  targetChainId,
}: UseTokenDeploymentParams): UseTokenDeploymentReturn {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentHash, setDeploymentHash] = useState<string | null>(null);
  const [deployedTokenAddress, setDeployedTokenAddress] = useState<
    string | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  const { writeContractAsync } = useWriteContract();

  // Wait for deployment transaction
  const { isLoading: isWaitingForDeployment, isSuccess: isDeploymentSuccess } =
    useWaitForTransactionReceipt({
      hash: deploymentHash as `0x${string}` | undefined,
      chainId: targetChainId,
    });

  const deployToken = useCallback(
    async (
      localTokenAddress: string,
      name: string,
      symbol: string,
    ): Promise<string> => {
      if (!writeContractAsync || !factoryAddress) {
        throw new Error('Missing required parameters for token deployment');
      }

      setIsDeploying(true);
      setError(null);
      setDeployedTokenAddress(null);

      try {
        console.log(
          `Deploying remote token for ${localTokenAddress}: ${name} (${symbol})`,
        );

        const hash = await writeContractAsync({
          address: factoryAddress as `0x${string}`,
          abi: ERC20FactoryAbi,
          functionName: 'createStandardL2Token',
          args: [
            localTokenAddress as `0x${string}`, // _remoteToken (L1 token address)
            name,
            symbol,
          ],
        });

        console.log('Token deployment transaction hash:', hash);
        setDeploymentHash(hash);

        // Return the transaction hash
        // The actual deployed token address will be available after transaction is mined
        return hash;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Token deployment failed';
        console.error('Token deployment failed:', err);
        setError(errorMessage);
        throw err;
      } finally {
        setIsDeploying(false);
      }
    },
    [writeContractAsync, factoryAddress],
  );

  const reset = useCallback(() => {
    setError(null);
    setIsDeploying(false);
    setDeploymentHash(null);
    setDeployedTokenAddress(null);
  }, []);

  return {
    deployToken,
    isDeploying: isDeploying || isWaitingForDeployment,
    deploymentHash,
    deployedTokenAddress,
    error,
    reset,
  };
}
