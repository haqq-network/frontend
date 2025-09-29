'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { erc20Abi } from 'viem';
import {
  useSwitchChain,
  useAccount,
  useWaitForTransactionReceipt,
  useReadContract,
} from 'wagmi';
import { BRIDGE_ADDRESSES, getChainById } from '@haqq/shell-shared';
import { Button } from '@haqq/shell-ui-kit';
import { Container } from '@haqq/shell-ui-kit/server';
import { useBridgeUrlState } from '../hooks/use-bridge-url-state';
import { useTokenDeployment } from '../hooks/use-token-deployment';

interface TokenInfo {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
}

export function TokenDeploymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { buildBridgeUrl } = useBridgeUrlState();

  const {
    address: userAddress,
    isConnected,
    chain: currentChain,
  } = useAccount();
  const { switchChainAsync } = useSwitchChain();

  const [deploymentHash, setDeploymentHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Parse URL parameters
  const tokenAddress = searchParams.get('token');
  const sourceChainId = searchParams.get('sourceChain');
  const targetChainId = searchParams.get('targetChain');
  const returnTokenIn = searchParams.get('returnTokenIn');
  const returnTokenOut = searchParams.get('returnTokenOut');
  const returnChainIn = searchParams.get('returnChainIn');
  const returnChainOut = searchParams.get('returnChainOut');
  const returnAmount = searchParams.get('returnAmount');

  const sourceChainIdNumber = sourceChainId
    ? parseInt(sourceChainId, 10)
    : null;
  const targetChainIdNumber = targetChainId
    ? parseInt(targetChainId, 10)
    : null;
  const sourceChain = sourceChainIdNumber
    ? getChainById(sourceChainIdNumber)
    : null;
  const targetChain = targetChainIdNumber
    ? getChainById(targetChainIdNumber)
    : null;

  // Get token information from source chain
  const { data: tokenName } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: 'name',
    chainId: sourceChainIdNumber || undefined,
    query: {
      enabled: Boolean(tokenAddress && sourceChainIdNumber),
    },
  });

  const { data: tokenSymbol } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: 'symbol',
    chainId: sourceChainIdNumber || undefined,
    query: {
      enabled: Boolean(tokenAddress && sourceChainIdNumber),
    },
  });

  const { data: tokenDecimals } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: 'decimals',
    chainId: sourceChainIdNumber || undefined,
    query: {
      enabled: Boolean(tokenAddress && sourceChainIdNumber),
    },
  });

  console.log({
    tokenName,
    tokenSymbol,
    tokenDecimals,
  });

  const tokenInfo: TokenInfo | null = useMemo(() => {
    if (
      !tokenAddress ||
      !tokenName ||
      !tokenSymbol ||
      tokenDecimals === undefined
    ) {
      return null;
    }
    return {
      address: tokenAddress,
      name: tokenName as string,
      symbol: tokenSymbol as string,
      decimals: tokenDecimals as number,
    };
  }, [tokenAddress, tokenName, tokenSymbol, tokenDecimals]);

  // Token deployment hook
  const {
    deployToken,
    isDeploying,
    error: deploymentError,
    reset: resetDeployment,
  } = useTokenDeployment({
    factoryAddress:
      BRIDGE_ADDRESSES.opChainDeployment
        .optimismMintableERC20FactoryProxyAddress,
    targetChainId: targetChainIdNumber || 0,
  });

  // Wait for deployment transaction
  const { isLoading: isWaitingForDeployment, isSuccess: isDeploymentSuccess } =
    useWaitForTransactionReceipt({
      hash: deploymentHash as `0x${string}` | undefined,
      chainId: targetChainIdNumber || undefined,
    });

  // Check if user is on correct chain
  const isOnCorrectChain = currentChain?.id === targetChainIdNumber;
  const needsChainSwitch = isConnected && !isOnCorrectChain;

  // Handle chain switch
  const handleSwitchChain = useCallback(async () => {
    if (!switchChainAsync || !targetChainIdNumber) return;

    try {
      setError(null);
      await switchChainAsync({ chainId: targetChainIdNumber });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to switch chain';
      setError(errorMessage);
    }
  }, [switchChainAsync, targetChainIdNumber]);

  // Handle token deployment
  const handleDeployToken = useCallback(async () => {
    if (!tokenInfo || !isOnCorrectChain) return;

    try {
      setError(null);
      const hash = await deployToken(
        tokenInfo.address,
        tokenInfo.name,
        tokenInfo.symbol,
      );
      setDeploymentHash(hash);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Token deployment failed';
      setError(errorMessage);
    }
  }, [tokenInfo, isOnCorrectChain, deployToken]);

  // Handle return to bridge
  const handleReturnToBridge = useCallback(() => {
    const bridgeState = {
      tokenIn: returnTokenIn || undefined,
      tokenOut: returnTokenOut || undefined,
      chainIn: returnChainIn ? parseInt(returnChainIn, 10) : undefined,
      chainOut: returnChainOut ? parseInt(returnChainOut, 10) : undefined,
      amount: returnAmount || undefined,
    };

    const bridgeUrl = buildBridgeUrl(bridgeState);
    router.push(bridgeUrl);
  }, [
    returnTokenIn,
    returnTokenOut,
    returnChainIn,
    returnChainOut,
    returnAmount,
    buildBridgeUrl,
    router,
  ]);

  // Auto-redirect on successful deployment
  useEffect(() => {
    if (isDeploymentSuccess) {
      // Wait a moment before redirecting to show success message
      const timer = setTimeout(() => {
        handleReturnToBridge();
      }, 3000);

      return () => {
        return clearTimeout(timer);
      };
    }
  }, [isDeploymentSuccess, handleReturnToBridge]);

  console.log({
    isConnected,
    tokenInfo,
    needsChainSwitch,
    isDeploying,
    isWaitingForDeployment,
    isDeploymentSuccess,
  });
  // Validation
  if (!tokenAddress || !sourceChainIdNumber || !targetChainIdNumber) {
    return (
      <Container>
        <div className="mx-auto max-w-[600px] py-[40px]">
          <div className="rounded-[12px] bg-white p-[24px] shadow-lg">
            <div className="text-center">
              <h1 className="mb-4 text-2xl font-bold text-red-600">
                Invalid Parameters
              </h1>
              <p className="mb-6 text-gray-600">
                Missing required token address, source chain ID, or target chain
                ID.
              </p>
              <Button
                onClick={() => {
                  return router.push('/bridge');
                }}
              >
                Return to Bridge
              </Button>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  if (!targetChain) {
    return (
      <Container>
        <div className="mx-auto max-w-[600px] py-[40px]">
          <div className="rounded-[12px] bg-white p-[24px] shadow-lg">
            <div className="text-center">
              <h1 className="mb-4 text-2xl font-bold text-red-600">
                Unsupported Chain
              </h1>
              <p className="mb-6 text-gray-600">
                Target chain ID {targetChainIdNumber} is not supported.
              </p>
              <Button
                onClick={() => {
                  return router.push('/bridge');
                }}
              >
                Return to Bridge
              </Button>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="mx-auto max-w-[600px] py-[40px]">
        <div className="rounded-[12px] bg-white p-[24px] shadow-lg">
          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              Deploy Token
            </h1>
            <p className="text-gray-600">
              Deploy {tokenInfo?.symbol || 'token'} on {targetChain.name} to
              enable bridging
            </p>
          </div>

          {/* Token Info */}
          {tokenInfo && (
            <div className="mb-6 rounded-lg bg-gray-50 p-4">
              <h3 className="mb-2 font-medium text-gray-900">Token Details</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Name:</span> {tokenInfo.name}
                </p>
                <p>
                  <span className="font-medium">Symbol:</span>{' '}
                  {tokenInfo.symbol}
                </p>
                <p>
                  <span className="font-medium">Address:</span>{' '}
                  {tokenInfo.address}
                </p>
                <p>
                  <span className="font-medium">Decimals:</span>{' '}
                  {tokenInfo.decimals}
                </p>
                <p>
                  <span className="font-medium">Source Chain:</span>{' '}
                  {sourceChain?.name || `Chain ${sourceChainIdNumber}`}
                </p>
              </div>
            </div>
          )}

          {/* Target Chain Info */}
          <div className="mb-6 rounded-lg bg-blue-50 p-4">
            <h3 className="mb-2 font-medium text-blue-900">Target Chain</h3>
            <div className="space-y-1 text-sm text-blue-700">
              <p>
                <span className="font-medium">Network:</span> {targetChain.name}
              </p>
              <p>
                <span className="font-medium">Chain ID:</span> {targetChain.id}
              </p>
            </div>
          </div>

          {/* Wallet Connection Warning */}
          {!isConnected && (
            <div className="mb-6 rounded-lg bg-yellow-50 p-4 text-yellow-700">
              <p className="text-sm font-medium">Wallet Not Connected</p>
              <p className="mt-1 text-xs">
                Please connect your wallet to deploy the token.
              </p>
            </div>
          )}

          {/* Chain Switch Warning */}
          {needsChainSwitch && (
            <div className="mb-6 rounded-lg bg-orange-50 p-4 text-orange-700">
              <p className="text-sm font-medium">Wrong Network</p>
              <p className="mt-1 text-xs">
                You need to switch to {targetChain.name} to deploy the token.
              </p>
              <Button onClick={handleSwitchChain} className="mt-2" variant={4}>
                Switch to {targetChain.name}
              </Button>
            </div>
          )}

          {/* Deployment Status */}
          {(isDeploying || isWaitingForDeployment) && (
            <div className="mb-6 rounded-lg bg-blue-50 p-4 text-blue-700">
              <p className="text-sm font-medium">
                {isDeploying
                  ? 'Deploying Token...'
                  : 'Waiting for Confirmation...'}
              </p>
              <p className="mt-1 text-xs">
                This may take a few minutes. Please don't close this page.
              </p>
              {deploymentHash && (
                <p className="mt-2 text-xs">
                  <span className="font-medium">Transaction:</span>{' '}
                  {deploymentHash.slice(0, 10)}...
                </p>
              )}
            </div>
          )}

          {/* Success Message */}
          {isDeploymentSuccess && (
            <div className="mb-6 rounded-lg bg-green-50 p-4 text-green-700">
              <p className="text-sm font-medium">
                Token Deployed Successfully!
              </p>
              <p className="mt-1 text-xs">
                {tokenInfo?.symbol} has been deployed on {targetChain.name}.
                Redirecting you back to the bridge...
              </p>
            </div>
          )}

          {/* Error Message */}
          {(error || deploymentError) && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
              <p className="text-sm font-medium">Error</p>
              <p className="mt-1 text-xs">{error || deploymentError}</p>
              <Button
                onClick={() => {
                  setError(null);
                  resetDeployment();
                }}
                className="mt-2"
                variant={2}
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={handleDeployToken}
              disabled={
                !isConnected ||
                !tokenInfo ||
                needsChainSwitch ||
                isDeploying ||
                isWaitingForDeployment ||
                isDeploymentSuccess
              }
              className="flex-1"
              variant={4}
            >
              {isDeploying || isWaitingForDeployment
                ? 'Deploying...'
                : `Deploy ${tokenInfo?.symbol || 'Token'}`}
            </Button>

            <Button
              onClick={handleReturnToBridge}
              variant={3}
              className="flex-1"
              disabled={isDeploying || isWaitingForDeployment}
            >
              Return to Bridge
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
