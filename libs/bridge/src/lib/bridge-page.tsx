'use client';
import { useState, useLayoutEffect, useEffect, useRef } from 'react';
import { useTranslate } from '@tolgee/react';
import { sepolia } from 'viem/chains';
import { useSwitchChain } from 'wagmi';
import {
  CHAIN_CONFIG,
  L2_STANDARD_BRIDGE_ADDRESS,
  bridgeSupportedChains,
  haqqTestethiq,
  L1_STANDARD_TESTETHIQ_BRIDGE_ADDRESS,
  L1_STANDARD_MAINNET_BRIDGE_ADDRESS,
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
import { getOpStackChains } from './constants/op-stack-config';
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
  useWithdrawalRecovery,
} from './hooks';

// SUPPORTED_CHAINS is now imported from @haqq/shell-shared

// SUPPORTED_CHAINS is now imported from @haqq/shell-shared
export const useChainProxyAddress = (chainId: number | undefined) => {
  if (chainId === CHAIN_CONFIG.l1ChainId) {
    return L1_STANDARD_MAINNET_BRIDGE_ADDRESS;
  }

  if (chainId === CHAIN_CONFIG.l1TestChainId) {
    return L1_STANDARD_TESTETHIQ_BRIDGE_ADDRESS;
  }

  if (
    chainId === CHAIN_CONFIG.l2ChainId ||
    chainId === CHAIN_CONFIG.l2TestChainId
  ) {
    return L2_STANDARD_BRIDGE_ADDRESS;
  }
  return '';
};

export function BridgePage() {
  const { t } = useTranslate('common');
  const { switchChainAsync } = useSwitchChain();

  // URL state management
  const { updateUrlState, buildDeploymentUrl, urlState } = useBridgeUrlState();

  // Withdrawal orders management
  const { pendingOrders, orders, syncWithdrawalsFromExplorer } =
    useWithdrawalOrders();

  // Withdrawal recovery for syncing withdrawals with full details
  const { recoverWithdrawal } = useWithdrawalRecovery();

  // Track if sync is in progress to prevent infinite loops
  const isSyncingRef = useRef(false);
  const lastSyncRef = useRef<{ address: string; chainId: number } | null>(null);

  // Store recoverWithdrawal in ref to prevent dependency changes
  const recoverWithdrawalRef = useRef(recoverWithdrawal);
  useEffect(() => {
    recoverWithdrawalRef.current = recoverWithdrawal;
  }, [recoverWithdrawal]);

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
  const { setTxHash, isWaitingForReceipt, isTxSuccess } =
    useBridgeTransactionReceipt();

  // Reset transaction success state when user changes network, amount, or token
  useEffect(() => {
    setTxHash(null);
  }, [chain?.id, bridgeAmount, selectedToken?.address, setTxHash]);

  // Sync withdrawals from explorer API when connected and on L2
  useEffect(() => {
    if (
      isConnected &&
      address &&
      isL2ToL1 &&
      !isSyncingRef.current &&
      chain?.id &&
      orders
    ) {
      // Check if we've already synced for this address/chain combination
      const lastSync = lastSyncRef.current;
      if (
        lastSync &&
        lastSync.address === address &&
        lastSync.chainId === chain.id
      ) {
        return; // Already synced for this address/chain
      }

      isSyncingRef.current = true;
      syncWithdrawalsFromExplorer(address, recoverWithdrawalRef.current)
        .then(() => {
          lastSyncRef.current = { address, chainId: chain.id };
        })
        .catch((error) => {
          console.error('Failed to sync withdrawals from explorer:', error);
        })
        .finally(() => {
          // Add a small delay before allowing next sync to prevent rapid re-syncing
          setTimeout(() => {
            isSyncingRef.current = false;
          }, 1000);
        });
    }
  }, [isConnected, address, isL2ToL1, chain?.id, syncWithdrawalsFromExplorer]);

  // Bridge transaction hook
  const { bridgeTokens, isProcessing, isProving, isFinalizing } =
    useBridgeTransaction({
      availableBalance,
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
  });

  // Handle chain switching on page mount
  useLayoutEffect(() => {
    // On page open: switch to sepolia if URL state doesn't have chainIn
    if (
      isConnected &&
      !urlState.chainIn &&
      !bridgeSupportedChains.some((chainItem) => {
        return chainItem.id === chain?.id;
      })
    ) {
      switchChainAsync({ chainId: getOpStackChains(chain?.id).L1.id }).catch(
        (error) => {
          console.error('Failed to switch to Sepolia on page load:', error);
        },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount

  return (
    <Container>
      <div className="mx-auto max-w-[600px] py-[40px]">
        <div className="rounded-[12px] bg-white p-[24px] shadow-lg">
          {(chain?.id === sepolia.id || chain?.id === haqqTestethiq.id) && (
            <FaucetLinksCard />
          )}

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

              {!isChainMismatch && (
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
              )}

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
