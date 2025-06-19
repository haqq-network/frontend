'use client';
import { useCallback, useMemo, useState } from 'react';
import { useTranslate } from '@tolgee/react';
import { formatUnits, parseEther } from 'viem';
import {
  useAccount,
  useBalance,
  useSendTransaction,
  useSwitchChain,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { Container } from '@haqq/shell-ui-kit/server';
import {
  BridgeHeader,
  WalletConnectionWarning,
  NetworkMismatchWarning,
  BridgeForm,
} from './components';
import { haqqDevnet1 } from '@haqq/shell-shared';
import { sepolia } from 'viem/chains';

// Bridge configuration
const L1_STANDARD_BRIDGE_ADDRESS = '0x4b317e25e14038ad8e9a35c1da1d2bc73859c7c7';

const SUPPORTED_CHAINS = [haqqDevnet1, sepolia];

export function BridgePage() {
  const { t } = useTranslate('common');
  const { address, chain, isConnected } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { sendTransactionAsync } = useSendTransaction();

  // State management
  const [bridgeAmount, setBridgeAmount] = useState<number | undefined>(
    undefined,
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  // Get user's ETH balance
  const { data: balance } = useBalance({
    address: address,
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

  // Memoize availableBalance for performance
  const availableBalance = useMemo(() => {
    if (!balance) return 0;
    return Number(formatUnits(balance.value, balance.decimals));
  }, [balance]);

  // Memoize receivedAmount (1:1 for ETH bridging)
  const receivedAmount = useMemo(() => {
    return bridgeAmount;
  }, [bridgeAmount]);

  // Memoize canBridge for performance
  const canBridge = useMemo(() => {
    return (
      isConnected &&
      bridgeAmount !== undefined &&
      bridgeAmount > 0 &&
      bridgeAmount <= availableBalance &&
      !isChainMismatch
    );
  }, [isConnected, bridgeAmount, availableBalance, isChainMismatch]);

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
    });
  };

  const amountHint = useMemo(() => {
    if (!bridgeAmount) {
      return (
        <span className="text-[#0D0D0E80]">
          Available: {formatNumber(availableBalance)} ETH
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
        Available: {formatNumber(availableBalance)} ETH
      </span>
    );
  }, [bridgeAmount, availableBalance, t]);

  const handleInputChange = useCallback((value: string | undefined) => {
    if (!value || value === '') {
      setBridgeAmount(undefined);
      return;
    }
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setBridgeAmount(numValue);
    }
  }, []);

  const handleMaxButtonClick = useCallback(() => {
    // Leave some ETH for gas fees
    const maxAmount = Math.max(0, availableBalance - 0.01);
    setBridgeAmount(maxAmount);
  }, [availableBalance]);

  const handleSwitchChain = useCallback(async () => {
    if (!switchChainAsync || !targetChainIdNumber) return;

    try {
      await switchChainAsync({ chainId: targetChainIdNumber });
    } catch (error) {
      console.error('Failed to switch chain:', error);
    }
  }, [switchChainAsync, targetChainIdNumber]);

  const handleBridge = useCallback(async () => {
    if (!canBridge || !address || !bridgeAmount) return;

    setIsProcessing(true);

    try {
      const amountWei = parseEther(bridgeAmount.toString());

      // Send transaction to L1 Standard Bridge
      const hash = await sendTransactionAsync({
        to: L1_STANDARD_BRIDGE_ADDRESS as `0x${string}`,
        value: amountWei,
      });

      setTxHash(hash);
    } catch (error) {
      console.error('Bridge transaction failed:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [canBridge, address, bridgeAmount, sendTransactionAsync]);

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
            />
          )}
        </div>
      </div>
    </Container>
  );
}
