'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslate } from '@tolgee/react';
import { useRouter } from 'next/navigation';
import { useSwitchChain, useWaitForTransactionReceipt } from 'wagmi';
import {
  L1_STANDARD_BRIDGE_ADDRESS,
  BRIDGE_ADDRESSES,
  CHAIN_CONFIG,
  SUPPORTED_CHAINS,
  L2_STANDARD_BRIDGE_ADDRESS,
} from '@haqq/shell-shared';
import { Container } from '@haqq/shell-ui-kit/server';
import {
  BridgeHeader,
  WalletConnectionWarning,
  NetworkMismatchWarning,
  BridgeForm,
  BridgeStatusMessages,
  ChallengePeriodWarning,
} from './components';
import {
  useBridgeState,
  useTokenAllowance,
  useTokenApproval,
  useBridgeTransaction,
  useBridgeTokenManager,
  useBridgeUrlState,
} from './hooks';

// SUPPORTED_CHAINS is now imported from @haqq/shell-shared

export const useChainProxyAddress = (chainId: number) => {
  if (chainId === CHAIN_CONFIG.l1ChainId) {
    return L1_STANDARD_BRIDGE_ADDRESS;
  }
  if (chainId === CHAIN_CONFIG.l2ChainId) {
    return L2_STANDARD_BRIDGE_ADDRESS;
  }
  return '';
};

export function BridgePage() {
  const { t } = useTranslate('common');
  const router = useRouter();
  const { switchChainAsync } = useSwitchChain();

  // URL state management
  const { updateUrlState, buildDeploymentUrl, clearUrlState } =
    useBridgeUrlState();

  // State management
  const [txHash, setTxHash] = useState<string | null>(null);

  // Use bridge state hook
  const {
    address,
    chain,
    isConnected,
    availableTokens,
    selectedToken,
    bridgeAmount,
    receivedAmount,
    availableBalance,
    isLoadingTokens,
    tokensError,
    userTokens,
    balance,
    formatNumber,
    handleInputChange,
    handleMaxButtonClick,
    handleTokenSelect,
  } = useBridgeState();

  // Determine source and target chains
  const sourceChainId = chain?.id;
  const targetChainId = useMemo(() => {
    // For now, assume L1 -> L2 bridging (Sepolia -> HAQQ Testedge2)
    if (sourceChainId === CHAIN_CONFIG.l1ChainId) {
      return CHAIN_CONFIG.l2ChainId;
    }
    // For L2 -> L1 bridging
    if (sourceChainId === CHAIN_CONFIG.l2ChainId) {
      return CHAIN_CONFIG.l1ChainId;
    }
    // Default fallback
    return CHAIN_CONFIG.l2ChainId;
  }, [sourceChainId]);

  // Check if this is an L2 to L1 transfer
  const isL2ToL1 = useMemo(() => {
    return (
      sourceChainId === CHAIN_CONFIG.l2ChainId &&
      targetChainId === CHAIN_CONFIG.l1ChainId
    );
  }, [sourceChainId, targetChainId]);

  // Sync URL state with bridge state
  useEffect(() => {
    if (selectedToken && chain?.id && bridgeAmount) {
      updateUrlState({
        tokenIn: selectedToken.address,
        chainIn: chain.id,
        chainOut: targetChainId,
        amount: bridgeAmount.toString(),
      });
    }
  }, [selectedToken, chain?.id, targetChainId, bridgeAmount, updateUrlState]);

  const bridgeAddress = useChainProxyAddress(sourceChainId);

  // Use bridge token manager for token validation
  const {
    remoteTokenAddress,
    needsDeployment,
    isCheckingRemoteToken,
    getRemoteTokenForBridge,
  } = useBridgeTokenManager({
    localToken: selectedToken || undefined,
    factoryAddress:
      BRIDGE_ADDRESSES.opChainDeployment
        .optimismMintableERC20FactoryProxyAddress,
    sourceChainId,
    targetChainId,
  });

  // Use allowance hook
  const { needsApproval, refetch: refetchAllowance } = useTokenAllowance({
    tokenAddress: selectedToken?.address,
    ownerAddress: address,
    spenderAddress: bridgeAddress,
    bridgeAmount,
    tokenDecimals: selectedToken?.decimals || balance?.decimals || 18,
  });

  const [tId, setTId] = useState<NodeJS.Timeout | null>(null);

  // Use approval hook
  const { approve, isApproving } = useTokenApproval({
    tokenAddress: selectedToken?.address,
    spenderAddress: bridgeAddress,
    onSuccess: (hash) => {
      console.log('Approval successful:', hash);

      if (tId) {
        clearTimeout(tId);
      }
      // Refetch allowance after successful approval
      const newTId = setTimeout(() => {
        refetchAllowance();
      }, 3000);

      setTId(newTId);
    },
    onError: (error) => {
      console.error('Approval failed:', error);
    },
  });

  // Use bridge transaction hook
  const { bridgeTokens, isProcessing, isProving, isFinalizing } =
    useBridgeTransaction({
      bridgeAddress: bridgeAddress,
      sourceChainId,
      targetChainId,
      onSuccess: (hash) => {
        console.log('Bridge successful:', hash);
        setTxHash(hash);
      },
      onError: (error) => {
        console.error('Bridge failed:', error);
      },
      onProveSuccess: (hash) => {
        console.log('Prove successful:', hash);
      },
      onFinalizeSuccess: (hash) => {
        console.log('Finalize successful:', hash);
      },
    });

  // Wait for transaction receipt
  const { isLoading: isWaitingForReceipt, isSuccess: isTxSuccess } =
    useWaitForTransactionReceipt({
      hash: txHash as `0x${string}` | undefined,
    });

  // Memoize isChainMismatch for performance and referential stability
  const isChainMismatch = useMemo(() => {
    return (
      chain != null &&
      !SUPPORTED_CHAINS.some((supportedChain) => {
        return supportedChain.id === chain.id;
      })
    );
  }, [chain]);

  const targetChainIdNumber = useMemo(() => {
    return isChainMismatch ? SUPPORTED_CHAINS[0].id : chain?.id;
  }, [chain, isChainMismatch]);

  // Memoize canBridge for performance
  const canBridge = useMemo(() => {
    return (
      isConnected &&
      selectedToken &&
      bridgeAmount !== undefined &&
      bridgeAmount > 0 &&
      bridgeAmount <= availableBalance &&
      !isChainMismatch &&
      !isCheckingRemoteToken
    );
  }, [
    isConnected,
    selectedToken,
    bridgeAmount,
    availableBalance,
    isChainMismatch,
    isCheckingRemoteToken,
  ]);

  const amountHint = useMemo(() => {
    if (!bridgeAmount) {
      return (
        <span className="text-[#0D0D0E80]">
          Available: {formatNumber(availableBalance)}{' '}
          {selectedToken?.symbol || 'ETH'}
        </span>
      );
    }

    if (bridgeAmount > availableBalance) {
      return (
        <span className="text-[#EC5728]">
          {t('insufficient-balance', 'Insufficient balance')}
        </span>
      );
    }

    return (
      <span className="text-[#0D0D0E80]">
        Available: {formatNumber(availableBalance)}{' '}
        {selectedToken?.symbol || 'ETH'}
      </span>
    );
  }, [bridgeAmount, availableBalance, selectedToken, formatNumber, t]);

  const handleApprove = useCallback(async () => {
    if (!selectedToken || !bridgeAmount) return;

    const tokenDecimals = selectedToken.decimals || balance?.decimals || 18;
    await approve(bridgeAmount, tokenDecimals);
  }, [selectedToken, bridgeAmount, balance, approve]);

  const handleTokenDeployment = useCallback(() => {
    if (!needsDeployment || !selectedToken || !sourceChainId || !targetChainId)
      return;

    // Redirect to deployment page instead of deploying inline
    const deploymentUrl = buildDeploymentUrl(
      selectedToken.address,
      sourceChainId,
      targetChainId,
    );
    router.push(deploymentUrl);
  }, [
    needsDeployment,
    selectedToken,
    sourceChainId,
    targetChainId,
    buildDeploymentUrl,
    router,
  ]);

  const handleBridge = useCallback(async () => {
    if (!canBridge || !address || !bridgeAmount || !selectedToken) return;

    // Check if token needs deployment first
    if (needsDeployment) {
      // Redirect to deployment page
      if (!sourceChainId) {
        console.error('Source chain ID is required for deployment');
        return;
      }
      const deploymentUrl = buildDeploymentUrl(
        selectedToken.address,
        sourceChainId,
        targetChainId,
      );
      router.push(deploymentUrl);
      return;
    }

    // Proceed with bridge if remote token exists
    try {
      const remoteTokenAddr = await getRemoteTokenForBridge();
      console.log('Remote token address for bridging:', remoteTokenAddr);

      const fallbackDecimals = balance?.decimals || 18;
      await bridgeTokens(
        selectedToken,
        bridgeAmount,
        address,
        remoteTokenAddr,
        fallbackDecimals,
      );
    } catch (error) {
      console.error('Bridge operation failed:', error);
    }
  }, [
    canBridge,
    address,
    bridgeAmount,
    selectedToken,
    balance,
    bridgeTokens,
    getRemoteTokenForBridge,
    needsDeployment,
    buildDeploymentUrl,
    targetChainId,
    router,
  ]);

  const handleSwitchChain = useCallback(async () => {
    console.log('handleSwitchChain', targetChainIdNumber);
    console.log('switchChainAsync', switchChainAsync);
    console.log('targetChainIdNumber', targetChainIdNumber);
    if (!switchChainAsync || !targetChainIdNumber) return;

    try {
      await switchChainAsync({ chainId: targetChainIdNumber });
      // Reset URL query parameters after successful chain switch
      clearUrlState();
    } catch (error) {
      console.error('Failed to switch chain:', error);
    }
  }, [switchChainAsync, targetChainIdNumber, clearUrlState]);

  return (
    <Container>
      <div className="mx-auto max-w-[600px] py-[40px]">
        <div className="rounded-[12px] bg-white p-[24px] shadow-lg">
          <BridgeHeader />

          {!isConnected && <WalletConnectionWarning />}

          {isChainMismatch && isConnected && (
            <NetworkMismatchWarning onSwitchChain={handleSwitchChain} />
          )}

          {isConnected && (
            <>
              <ChallengePeriodWarning isL2ToL1={isL2ToL1} />

              <BridgeStatusMessages
                tokensError={tokensError}
                isLoadingTokens={isLoadingTokens}
                userTokens={userTokens}
                needsApproval={needsApproval}
                selectedToken={selectedToken}
                isCheckingRemoteToken={isCheckingRemoteToken}
                needsDeployment={needsDeployment}
                onDeployToken={handleTokenDeployment}
                remoteTokenAddress={remoteTokenAddress}
                isProving={isProving}
                isFinalizing={isFinalizing}
              />

              <BridgeForm
                bridgeAmount={bridgeAmount}
                receivedAmount={receivedAmount}
                availableBalance={availableBalance}
                canBridge={Boolean(canBridge)}
                isProcessing={isProcessing}
                isProving={isProving}
                isFinalizing={isFinalizing}
                isWaitingForReceipt={Boolean(isWaitingForReceipt)}
                isTxSuccess={Boolean(isTxSuccess)}
                onInputChange={handleInputChange}
                onMaxButtonClick={handleMaxButtonClick}
                onBridge={handleBridge}
                amountHint={amountHint}
                tokens={availableTokens}
                selectedToken={selectedToken}
                onTokenSelect={handleTokenSelect}
                isLoadingTokens={isLoadingTokens}
                needsApproval={needsApproval}
                isApproving={isApproving}
                onApprove={handleApprove}
              />
            </>
          )}
        </div>
      </div>
    </Container>
  );
}
