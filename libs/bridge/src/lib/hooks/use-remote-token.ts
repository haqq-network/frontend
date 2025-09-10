'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { erc20Abi } from 'viem';
import { useReadContract, useWriteContract, usePublicClient } from 'wagmi';
import { ERC20FactoryAbi } from '../abi/erc20-factory';

interface UseRemoteTokenParams {
  localTokenAddress?: string;
  factoryAddress?: string;
  targetChainId?: number;
}

interface UseRemoteTokenReturn {
  remoteTokenAddress: string | undefined;
  isLoading: boolean;
  error: Error | null;
  deployRemoteToken: (name: string, symbol: string) => Promise<string>;
  isDeploying: boolean;
  refetch: () => void;
}

/**
 * Hook to check remote token existence and deploy if needed
 */
export function useRemoteToken({
  localTokenAddress,
  factoryAddress,
  targetChainId,
}: UseRemoteTokenParams): UseRemoteTokenReturn {
  const publicClient = usePublicClient({ chainId: targetChainId });
  const { writeContractAsync } = useWriteContract();

  // Note: OptimismMintableERC20Factory doesn't have a deployments mapping
  // We need to use events or calculate the token address deterministically
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [remoteTokenAddress, setRemoteTokenAddress] = useState<
    string | undefined
  >(undefined);

  // Calculate the expected remote token address using CREATE2
  const calculateRemoteTokenAddress = useCallback(
    (
      factoryAddr: string,
      remoteToken: string,
      name: string,
      symbol: string,
    ): string => {
      // For now, return a placeholder - in practice, you'd implement CREATE2 address calculation
      // This would require the same salt and bytecode hash used by the factory
      console.log('Calculating remote token address for:', {
        remoteToken,
        name,
        symbol,
      });

      // Placeholder - in real implementation, calculate CREATE2 address
      return `0x${remoteToken.slice(2).toLowerCase()}000000000000000000000000`;
    },
    [],
  );

  // Check if remote token exists by trying to call version() on the calculated address
  const checkRemoteTokenExists = useCallback(async (): Promise<
    string | null
  > => {
    if (!publicClient || !factoryAddress || !localTokenAddress) {
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First, we need the token name and symbol to calculate the address
      // For now, we'll use a simple approach - try to find existing deployment events
      const logs = await publicClient.getLogs({
        address: factoryAddress as `0x${string}`,
        event: {
          type: 'event',
          name: 'StandardL2TokenCreated',
          inputs: [
            { name: 'remoteToken', type: 'address', indexed: true },
            { name: 'localToken', type: 'address', indexed: true },
          ],
        },
        args: {
          remoteToken: localTokenAddress as `0x${string}`, // L1 token is the remoteToken
        },
        fromBlock: 'earliest',
        toBlock: 'latest',
      });

      if (logs.length > 0) {
        // Get the localToken (L2 token) from the most recent deployment
        const latestLog = logs[logs.length - 1];
        const deployedTokenAddress = latestLog.args.localToken;
        console.log(
          'Found existing remote token via events:',
          deployedTokenAddress,
        );

        // Verify the token exists by calling version()
        try {
          await publicClient.readContract({
            address: deployedTokenAddress as `0x${string}`,
            abi: [
              {
                inputs: [],
                name: 'version',
                outputs: [{ name: '', type: 'string' }],
                stateMutability: 'view',
                type: 'function',
              },
            ],
            functionName: 'version',
          });

          console.log('Verified remote token exists:', deployedTokenAddress);
          return deployedTokenAddress as string;
        } catch (versionError) {
          console.log(
            'Remote token address found in events but version() call failed:',
            versionError,
          );
          return null;
        }
      }

      return null;
    } catch (err) {
      console.error('Error checking remote token:', err);
      setError(err as Error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [publicClient, factoryAddress, localTokenAddress]);

  const deployRemoteToken = useCallback(
    async (name: string, symbol: string): Promise<string> => {
      if (!writeContractAsync || !factoryAddress || !localTokenAddress) {
        throw new Error('Missing required parameters for token deployment');
      }

      console.log(
        `Deploying remote token for ${localTokenAddress}: ${name} (${symbol}) using createStandardL2Token`,
      );

      try {
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

        // Wait for transaction to be mined and get the deployed token address
        // This would typically require waiting for the transaction receipt
        // and parsing the event logs to get the deployed token address

        return hash; // Return transaction hash for now
      } catch (err) {
        console.error('Token deployment failed:', err);
        throw err;
      }
    },
    [writeContractAsync, factoryAddress, localTokenAddress],
  );

  const isDeploying = false; // TODO: Track deployment state

  const refetch = useCallback(async () => {
    const result = await checkRemoteTokenExists();
    setRemoteTokenAddress(result || undefined);
  }, [checkRemoteTokenExists]);

  // Initialize remote token check on mount
  React.useEffect(() => {
    if (localTokenAddress && factoryAddress) {
      refetch();
    }
  }, [localTokenAddress, factoryAddress, refetch]);

  return {
    remoteTokenAddress,
    isLoading,
    error,
    deployRemoteToken,
    isDeploying,
    refetch,
  };
}
