'use client';
import { useCallback, useMemo, useState } from 'react';
import { useTranslate } from '@tolgee/react';
import { haqqMainnet, haqqTestedge2, sepolia } from 'viem/chains';
import { useSwitchChain, useWaitForTransactionReceipt } from 'wagmi';
import {
  haqqDevnet1,
  L1_STANDARD_BRIDGE_ADDRESS,
  BRIDGE_ADDRESSES,
  CHAIN_CONFIG,
} from '@haqq/shell-shared';
import { Container } from '@haqq/shell-ui-kit/server';
import {
  BridgeHeader,
  WalletConnectionWarning,
  NetworkMismatchWarning,
  BridgeForm,
  BridgeStatusMessages,
} from './components';
import {
  useBridgeState,
  useTokenAllowance,
  useTokenApproval,
  useBridgeTransaction,
  useBridgeTokenManager,
} from './hooks';

const SUPPORTED_CHAINS = [haqqDevnet1, haqqMainnet, haqqTestedge2, sepolia];

export function BridgePage() {
  const { t } = useTranslate('common');
  const { switchChainAsync } = useSwitchChain();

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

  // Use bridge token manager for token validation and deployment
  const {
    remoteTokenAddress,
    needsDeployment,
    isCheckingRemoteToken,
    deployRemoteToken,
    isDeploying,
    deploymentError,
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
  const {
    allowance,
    needsApproval,
    refetch: refetchAllowance,
  } = useTokenAllowance({
    tokenAddress: selectedToken?.address,
    ownerAddress: address,
    spenderAddress: L1_STANDARD_BRIDGE_ADDRESS,
    bridgeAmount,
    tokenDecimals: selectedToken?.decimals || balance?.decimals || 18,
  });

  // Use approval hook
  const { approve, isApproving } = useTokenApproval({
    tokenAddress: selectedToken?.address,
    spenderAddress: L1_STANDARD_BRIDGE_ADDRESS,
    onSuccess: (hash) => {
      console.log('Approval successful:', hash);
      // Refetch allowance after successful approval
      setTimeout(() => {
        refetchAllowance();
      }, 3000);
    },
    onError: (error) => {
      console.error('Approval failed:', error);
    },
  });

  // Use bridge transaction hook
  const { bridgeTokens, isProcessing } = useBridgeTransaction({
    bridgeAddress: L1_STANDARD_BRIDGE_ADDRESS,
    onSuccess: (hash) => {
      console.log('Bridge successful:', hash);
      setTxHash(hash);
    },
    onError: (error) => {
      console.error('Bridge failed:', error);
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
      !isCheckingRemoteToken &&
      !isDeploying
    );
  }, [
    isConnected,
    selectedToken,
    bridgeAmount,
    availableBalance,
    isChainMismatch,
    isCheckingRemoteToken,
    isDeploying,
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

  const handleTokenDeployment = useCallback(async () => {
    if (!needsDeployment) return;

    try {
      console.log('Deploying remote token for bridging...');
      await deployRemoteToken();
    } catch (error) {
      console.error('Token deployment failed:', error);
    }
  }, [needsDeployment, deployRemoteToken]);

  const handleBridge = useCallback(async () => {
    if (!canBridge || !address || !bridgeAmount || !selectedToken) return;

    // First, ensure remote token exists or deploy it
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
  ]);

  const handleSwitchChain = useCallback(async () => {
    console.log('handleSwitchChain', targetChainIdNumber);
    console.log('switchChainAsync', switchChainAsync);
    console.log('targetChainIdNumber', targetChainIdNumber);
    if (!switchChainAsync || !targetChainIdNumber) return;

    try {
      await switchChainAsync({ chainId: targetChainIdNumber });
    } catch (error) {
      console.error('Failed to switch chain:', error);
    }
  }, [switchChainAsync, targetChainIdNumber]);

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
              <BridgeStatusMessages
                tokensError={tokensError}
                isLoadingTokens={isLoadingTokens}
                userTokens={userTokens}
                needsApproval={needsApproval}
                selectedToken={selectedToken}
                isCheckingRemoteToken={isCheckingRemoteToken}
                needsDeployment={needsDeployment}
                isDeploying={isDeploying}
                deploymentError={deploymentError}
                onDeployToken={handleTokenDeployment}
                remoteTokenAddress={remoteTokenAddress}
              />

              <BridgeForm
                bridgeAmount={bridgeAmount}
                receivedAmount={receivedAmount}
                availableBalance={availableBalance}
                canBridge={Boolean(canBridge)}
                isProcessing={isProcessing}
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
