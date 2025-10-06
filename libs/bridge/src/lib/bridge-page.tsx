'use client';
import { useState } from 'react';
import { useTranslate } from '@tolgee/react';
import { sepolia } from 'viem/chains';
import { useSwitchChain } from 'wagmi';
import {
  L1_STANDARD_BRIDGE_ADDRESS,
  CHAIN_CONFIG,
  L2_STANDARD_BRIDGE_ADDRESS,
} from '@haqq/shell-shared';
import { Container } from '@haqq/shell-ui-kit/server';
import {
  WalletConnectionWarning,
  NetworkMismatchWarning,
  BridgeForm,
  BridgeStatusMessages,
  ChallengePeriodWarning,
  PendingWithdrawals,
  RecoveryLink,
  FaucetLinksCard,
} from './components';
import {
  useBridgeState,
  useTokenAllowance,
  useTokenApproval,
  useBridgeTransaction,
  useBridgeTokenManager,
  useBridgeUrlState,
  useWithdrawalOrders,
  useBridgeChains,
  useBridgeValidation,
  useBridgeHandlers,
  useBridgeTransactionReceipt,
} from './hooks';

// SUPPORTED_CHAINS is now imported from @haqq/shell-shared

export const useChainProxyAddress = (chainId: number | undefined) => {
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
  const { switchChainAsync } = useSwitchChain();

  // URL state management
  const { updateUrlState, buildDeploymentUrl, clearUrlState, urlState } =
    useBridgeUrlState();

  // Withdrawal orders management
  const { pendingOrders } = useWithdrawalOrders();

  // Bridge state hook - handles token selection and amounts
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
    balance,
    formatNumber,
    handleInputChange,
    handleMaxButtonClick,
    handleTokenSelect,
  } = useBridgeState({
    urlState,
    updateUrlState,
  });

  // Chain management hook - determines source/target chains
  const {
    sourceChainId,
    targetChainId,
    isL2ToL1,
    isChainMismatch,
    targetChainIdNumber,
  } = useBridgeChains({
    chainId: chain?.id,
  });

  const bridgeAddress = useChainProxyAddress(sourceChainId);

  // Use bridge token manager for token validation
  const {
    remoteTokenAddress,
    needsDeployment,
    isCheckingRemoteToken,
    getRemoteTokenForBridge,
  } = useBridgeTokenManager({
    localToken: selectedToken || undefined,
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

  // Transaction receipt management
  const { txHash, setTxHash, isWaitingForReceipt, isTxSuccess } =
    useBridgeTransactionReceipt();

  // Bridge transaction hook
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

  // Bridge validation hook
  const { canBridge, amountHint } = useBridgeValidation({
    isConnected,
    selectedToken,
    bridgeAmount,
    availableBalance,
    isChainMismatch,
    isCheckingRemoteToken,
    formatNumber,
  });

  // Bridge handlers hook - consolidates all action handlers
  const {
    handleApprove,
    handleTokenDeployment,
    handleBridge,
    handleSwitchChain,
  } = useBridgeHandlers({
    selectedToken,
    bridgeAmount,
    balance,
    approve,
    canBridge,
    address,
    needsDeployment,
    sourceChainId,
    targetChainId,
    getRemoteTokenForBridge,
    bridgeTokens,
    buildDeploymentUrl,
    switchChainAsync,
    targetChainIdNumber,
    clearUrlState,
  });

  return (
    <Container>
      <div className="mx-auto max-w-[600px] py-[40px]">
        <div className="rounded-[12px] bg-white p-[24px] shadow-lg">
          {chain?.id === sepolia.id && <FaucetLinksCard />}

          {!isConnected && <WalletConnectionWarning />}

          {isChainMismatch && isConnected && (
            <NetworkMismatchWarning onSwitchChain={handleSwitchChain} />
          )}

          {isConnected && (
            <>
              <BridgeStatusMessages
                tokensError={tokensError}
                isLoadingTokens={isLoadingTokens}
                needsApproval={needsApproval}
                selectedToken={selectedToken}
                isCheckingRemoteToken={isCheckingRemoteToken}
                needsDeployment={needsDeployment}
                onDeployToken={handleTokenDeployment}
                remoteTokenAddress={remoteTokenAddress}
                remoteTokenChainId={targetChainId}
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
                disabledApproveBtn={
                  isApproving || needsDeployment || isCheckingRemoteToken
                }
                onApprove={handleApprove}
              />

              <ChallengePeriodWarning isL2ToL1={isL2ToL1} />

              {isL2ToL1 && pendingOrders.length > 0 && (
                <PendingWithdrawals orders={pendingOrders} />
              )}

              <RecoveryLink />
            </>
          )}
        </div>
      </div>
    </Container>
  );
}
