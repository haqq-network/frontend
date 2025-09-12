'use client';

import { useCallback, useState } from 'react';
import { erc20Abi } from 'viem';
import { useWriteContract, usePublicClient, useReadContract } from 'wagmi';
import { ERC20FactoryAbi } from '../abi/erc20-factory';

interface Token {
  symbol: string;
  address: string;
  name?: string;
  decimals?: number;
}

interface UseStandardTokenParams {
  localToken?: Token;
  factoryAddress?: string;
  targetChainId?: number;
}

interface UseStandardTokenReturn {
  remoteTokenAddress: string | null;
  needsDeployment: boolean;
  isCheckingToken: boolean;
  deployToken: () => Promise<string>;
  isDeploying: boolean;
  error: string | null;
}

const ETH_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

/**
 * Hook to manage standard L2 token creation and verification
 */
export function useStandardToken({
  localToken,
  factoryAddress,
  targetChainId,
}: UseStandardTokenParams): UseStandardTokenReturn {
  const [remoteTokenAddress, setRemoteTokenAddress] = useState<string | null>(
    null,
  );
  const [isCheckingToken, setIsCheckingToken] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const publicClient = usePublicClient({ chainId: targetChainId });
  const { writeContractAsync } = useWriteContract();

  // Get token metadata from the source token
  const { data: tokenName } = useReadContract({
    address: localToken?.address as `0x${string}`,
    abi: erc20Abi,
    functionName: 'name',
    query: {
      enabled: Boolean(
        localToken?.address && localToken.address !== ETH_ADDRESS,
      ),
    },
  });

  const { data: tokenSymbol } = useReadContract({
    address: localToken?.address as `0x${string}`,
    abi: erc20Abi,
    functionName: 'symbol',
    query: {
      enabled: Boolean(
        localToken?.address && localToken.address !== ETH_ADDRESS,
      ),
    },
  });

  // Check if remote token exists by looking for StandardL2TokenCreated events
  const checkRemoteTokenExists = useCallback(async (): Promise<
    string | null
  > => {
    if (
      !publicClient ||
      !factoryAddress ||
      !localToken?.address ||
      localToken.address === ETH_ADDRESS
    ) {
      return null;
    }

    setIsCheckingToken(true);
    setError(null);

    try {
      console.log(
        `Checking for existing remote token for ${localToken.address}`,
      );
      // Verify the token exists by calling version()
      try {
        const version = await publicClient.readContract({
          address: localToken.address as `0x${string}`,
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

        console.log(`Remote token verified with version: ${version}`);
        return version;
      } catch (versionError) {
        console.log('Version check failed, token may not exist:', versionError);
        return null;
      }
    } catch (err) {
      console.error('Error checking remote token:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to check remote token',
      );
      return null;
    } finally {
      setIsCheckingToken(false);
    }
  }, [publicClient, factoryAddress, localToken?.address]);

  // Deploy remote token using createStandardL2Token
  const deployToken = useCallback(async (): Promise<string> => {
    if (
      !writeContractAsync ||
      !factoryAddress ||
      !localToken?.address ||
      !tokenName ||
      !tokenSymbol
    ) {
      throw new Error('Missing required parameters for token deployment');
    }

    setIsDeploying(true);
    setError(null);

    try {
      console.log(
        `Deploying standard L2 token for ${localToken.address}: ${tokenName} (${tokenSymbol})`,
      );

      const hash = await writeContractAsync({
        address: factoryAddress as `0x${string}`,
        abi: ERC20FactoryAbi,
        functionName: 'createStandardL2Token',
        args: [
          localToken.address as `0x${string}`, // _remoteToken (L1 token)
          tokenName as string,
          tokenSymbol as string,
        ],
      });

      console.log('Token deployment transaction:', hash);
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
  }, [
    writeContractAsync,
    factoryAddress,
    localToken?.address,
    tokenName,
    tokenSymbol,
  ]);

  const needsDeployment = Boolean(
    localToken?.address &&
      localToken.address !== ETH_ADDRESS &&
      !remoteTokenAddress &&
      !isCheckingToken &&
      tokenName &&
      tokenSymbol,
  );

  return {
    remoteTokenAddress,
    needsDeployment,
    isCheckingToken,
    deployToken,
    isDeploying,
    error,
  };
}
