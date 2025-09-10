'use client';
import { useCallback, useMemo, useState } from 'react';
import { useTranslate } from '@tolgee/react';
import { formatUnits, parseEther, parseUnits } from 'viem';
import { sepolia } from 'viem/chains';
import {
  useAccount,
  useBalance,
  useSendTransaction,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import {
  haqqDevnet1,
  SWAPPABLE_TOKENS,
  L1StandardBridgeAbi,
  L1_STANDARD_BRIDGE_ADDRESS,
} from '@haqq/shell-shared';
import { Container } from '@haqq/shell-ui-kit/server';
import {
  BridgeHeader,
  WalletConnectionWarning,
  NetworkMismatchWarning,
  BridgeForm,
} from './components';
import { useTokenBalances } from './hooks/use-token-balances';

const SUPPORTED_CHAINS = [haqqDevnet1, sepolia];

// ETH token constant
const ETH_TOKEN = {
  symbol: 'ETH',
  address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  name: 'Ethereum',
};

interface Token {
  symbol: string;
  address: string;
  name?: string;
  balance?: string;
  decimals?: number;
  formattedBalance?: number;
}

export function BridgePage() {
  const { t } = useTranslate('common');
  const { address, chain, isConnected } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { sendTransactionAsync } = useSendTransaction();
  const { writeContractAsync } = useWriteContract();

  // Fetch user token balances dynamically
  const {
    tokens: userTokens,
    isLoading: isLoadingTokens,
    error: tokensError,
  } = useTokenBalances();

  // State management
  const [bridgeAmount, setBridgeAmount] = useState<number | undefined>(
    undefined,
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [selectedToken, setSelectedToken] = useState<Token | null>(ETH_TOKEN);

  // Get available tokens for current chain (dynamically fetched with fallback)
  const availableTokens = useMemo(() => {
    if (!chain) return [ETH_TOKEN];

    // If we're still loading tokens, return ETH token as fallback
    if (isLoadingTokens) {
      return [ETH_TOKEN];
    }

    // If there's an error or no tokens, use SWAPPABLE_TOKENS as fallback
    if (tokensError || userTokens.length === 0) {
      console.log(
        'API token fetch failed or returned empty list, using SWAPPABLE_TOKENS fallback',
      );
      console.log('Error:', tokensError);
      console.log('User tokens count:', userTokens.length);

      const chainTokens = SWAPPABLE_TOKENS[chain.id] || [];

      if (chainTokens.length === 0) {
        console.log(
          'No SWAPPABLE_TOKENS for chain',
          chain.id,
          ', using ETH token only',
        );
        return [ETH_TOKEN];
      }

      console.log(
        'Using SWAPPABLE_TOKENS for chain',
        chain.id,
        ':',
        chainTokens,
      );
      return [
        ...chainTokens.map((token) => {
          return {
            ...token,
            name: token.symbol === 'USDC' ? 'USD Coin' : token.symbol,
          };
        }),
      ];
    }

    console.log('Successfully loaded', userTokens.length, 'tokens from API');
    // Convert user tokens to the expected format
    return userTokens.map((token) => {
      return {
        symbol: token.symbol,
        address: token.address,
        name: token.name,
        balance: token.balance,
        decimals: token.decimals,
        formattedBalance: token.formattedBalance,
      };
    });
  }, [chain, userTokens, isLoadingTokens, tokensError]);

  // Get user's balance for selected token
  const { data: balance } = useBalance({
    address: address,
    token:
      selectedToken?.address === ETH_TOKEN.address
        ? undefined
        : (selectedToken?.address as `0x${string}`),
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
    // If we have token data from the API, use that
    if (selectedToken?.formattedBalance !== undefined) {
      return selectedToken.formattedBalance;
    }

    // Fallback to wagmi balance
    if (!balance) return 0;
    return Number(formatUnits(balance.value, balance.decimals));
  }, [balance, selectedToken]);

  // Memoize receivedAmount (1:1 for bridging)
  const receivedAmount = useMemo(() => {
    return bridgeAmount;
  }, [bridgeAmount]);

  // Memoize canBridge for performance
  const canBridge = useMemo(() => {
    return (
      isConnected &&
      selectedToken &&
      bridgeAmount !== undefined &&
      bridgeAmount > 0 &&
      bridgeAmount <= availableBalance &&
      !isChainMismatch
    );
  }, [
    isConnected,
    selectedToken,
    bridgeAmount,
    availableBalance,
    isChainMismatch,
  ]);

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
  }, [bridgeAmount, availableBalance, selectedToken, t]);

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
    // Leave some for gas fees
    const maxAmount = Math.max(
      0,
      availableBalance -
        (selectedToken?.address === ETH_TOKEN.address ? 0.001 : 0),
    );
    setBridgeAmount(maxAmount);
  }, [availableBalance, selectedToken]);

  const handleTokenSelect = useCallback((token: Token) => {
    setSelectedToken(token);
    setBridgeAmount(undefined); // Reset amount when token changes
  }, []);

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

  const handleBridge = useCallback(async () => {
    if (!canBridge || !address || !bridgeAmount || !selectedToken) return;

    setIsProcessing(true);

    try {
      let hash: string;

      if (selectedToken.address === ETH_TOKEN.address) {
        // Bridge ETH
        const amountWei = parseEther(bridgeAmount.toString());
        hash = await sendTransactionAsync({
          to: L1_STANDARD_BRIDGE_ADDRESS as `0x${string}`,
          value: amountWei,
        });
      } else {
        // Bridge ERC20 token
        const tokenDecimals = balance?.decimals || 18;
        const amountWei = parseUnits(bridgeAmount.toString(), tokenDecimals);

        hash = await writeContractAsync({
          address: L1_STANDARD_BRIDGE_ADDRESS as `0x${string}`,
          abi: L1StandardBridgeAbi,
          functionName: 'bridgeERC20To',
          args: [
            selectedToken.address as `0x${string}`, // _localToken
            selectedToken.address as `0x${string}`, // _remoteToken (same for now)
            address, // _to
            amountWei, // _amount
            200000, // _minGasLimit
            '0x' as `0x${string}`, // _extraData
          ],
        });
      }

      setTxHash(hash);
    } catch (error) {
      console.error('Bridge transaction failed:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [
    canBridge,
    address,
    bridgeAmount,
    selectedToken,
    balance,
    sendTransactionAsync,
    writeContractAsync,
  ]);

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
              {tokensError && (
                <div className="mb-4 rounded-lg bg-yellow-50 p-4 text-yellow-700">
                  <p className="text-sm">
                    Failed to load token balances: {tokensError}
                  </p>
                  <p className="mt-1 text-xs">
                    Using fallback token list. Check console for details.
                  </p>
                </div>
              )}

              {isLoadingTokens && (
                <div className="mb-4 rounded-lg bg-blue-50 p-4 text-blue-700">
                  <p className="text-sm">Loading your token balances...</p>
                </div>
              )}

              {!isLoadingTokens && !tokensError && userTokens.length > 0 && (
                <div className="mb-4 rounded-lg bg-green-50 p-4 text-green-700">
                  <p className="text-sm">
                    Loaded {userTokens.length} token
                    {userTokens.length !== 1 ? 's' : ''} from your wallet
                  </p>
                </div>
              )}

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
              />
            </>
          )}
        </div>
      </div>
    </Container>
  );
}
