'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { Chain, formatUnits } from 'viem';
import { useAccount, useBalance, useSwitchChain } from 'wagmi';
import { SUPPORTED_CHAINS, SWAPPABLE_TOKENS } from '@haqq/shell-shared';
import { BridgeUrlState } from './use-bridge-url-state';
import { useTokenBalances } from './use-token-balances';

interface Token {
  symbol: string;
  address: string;
  name?: string;
  balance?: string;
  decimals?: number;
  formattedBalance?: number;
}

const ETH_TOKEN: Token = {
  symbol: 'ETH',
  address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  name: 'Ethereum',
};

export interface UseBridgeStateParams {
  urlState: BridgeUrlState;
  updateUrlState: (newState: Partial<BridgeUrlState>) => void;
}

interface UseBridgeStateReturn {
  // Account state
  address: string | undefined;
  chain: Chain | undefined;
  isConnected: boolean;

  // Token state
  availableTokens: Token[];
  selectedToken: Token | null;
  setSelectedToken: (token: Token | null) => void;

  // Amount state
  bridgeAmount: number | undefined;
  setBridgeAmount: (amount: number | undefined) => void;
  receivedAmount: number | undefined;
  availableBalance: number;

  // Token loading state
  isLoadingTokens: boolean;
  tokensError: string | null;
  userTokens: any[];

  // Balance data
  balance: any;

  // UI helpers
  formatNumber: (num: number) => string;
  handleInputChange: (value: string | undefined) => void;
  handleMaxButtonClick: () => void;
  handleTokenSelect: (token: Token) => void;
}

/**
 * Hook to manage bridge state and token selection logic
 * Handles bidirectional synchronization with URL state
 */
export function useBridgeState({
  urlState,
  updateUrlState,
}: UseBridgeStateParams): UseBridgeStateReturn {
  const { address, chain, isConnected } = useAccount();

  // Fetch user token balances dynamically
  const {
    tokens: userTokens,
    isLoading: isLoadingTokens,
    error: tokensError,
  } = useTokenBalances();

  const { switchChainAsync } = useSwitchChain();

  // State management
  const [bridgeAmount, setBridgeAmount] = useState<number | undefined>(() => {
    return urlState?.amount ? Number(urlState.amount) : undefined;
  });
  const [selectedToken, setSelectedToken] = useState<Token | null>();
  const [previousChainId, setPreviousChainId] = useState<number | undefined>();

  // Clear URL state and reset amount/selected token when chain changes
  useEffect(() => {
    // Skip on initial mount or if chain is undefined
    if (!chain?.id || previousChainId === undefined) {
      setPreviousChainId(chain?.id);
      if (urlState?.chainIn && chain?.id !== urlState?.chainIn) {
        switchChainAsync({ chainId: urlState?.chainIn });
      }
      return;
    }

    // If chain actually changed (not just a re-render)
    if (chain.id !== previousChainId) {
      // Clear URL state
      updateUrlState({
        tokenIn: undefined,
        amount: undefined,
      });

      // Reset local state
      setBridgeAmount(0);
      setSelectedToken(ETH_TOKEN);

      // Update previous chain ID
      setPreviousChainId(chain.id);
    }
  }, [chain?.id, previousChainId, updateUrlState]);

  // Initialize state from URL parameters
  useEffect(() => {
    if (urlState?.tokenIn && userTokens.length > 0 && !isLoadingTokens) {
      const targetToken = userTokens.find((token) => {
        return (
          token.address?.toLowerCase() === urlState?.tokenIn?.toLowerCase()
        );
      });
      if (targetToken) {
        setSelectedToken(targetToken);
      }
    }
  }, [urlState?.tokenIn, userTokens, isLoadingTokens]);

  // Sync state changes to URL
  useLayoutEffect(() => {
    // Wait until tokens are finished loading before syncing to URL
    if (isLoadingTokens || userTokens.length === 0) {
      return;
    }
    if (
      selectedToken &&
      chain?.id &&
      bridgeAmount !== undefined &&
      SUPPORTED_CHAINS.some((itemChain) => {
        return chain.id === itemChain.id;
      })
    ) {
      updateUrlState({
        tokenIn: selectedToken.address,
        chainIn: chain.id,
        amount: bridgeAmount.toString(),
      });
    }
  }, [selectedToken, chain?.id, bridgeAmount, updateUrlState, isLoadingTokens]);

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

  const formatNumber = useCallback((num: number) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
    });
  }, []);

  const handleInputChange = useCallback((value: string | undefined) => {
    if (!value || value === '') {
      setBridgeAmount(undefined);
      return;
    }
    // Remove commas and other formatting characters, but keep decimal point
    const cleanedValue = value.replace(/,/g, '').trim();
    const numValue = Number(cleanedValue);
    if (!isNaN(numValue) && isFinite(numValue)) {
      setBridgeAmount(numValue);
    }
  }, []);

  const handleMaxButtonClick = useCallback(() => {
    setBridgeAmount(availableBalance);
  }, [availableBalance, selectedToken]);

  const handleTokenSelect = useCallback((token: Token) => {
    setSelectedToken(token);
  }, []);

  return {
    // Account state
    address,
    chain,
    isConnected,

    // Token state
    availableTokens,
    selectedToken: selectedToken || ETH_TOKEN,
    setSelectedToken,

    // Amount state
    bridgeAmount,
    setBridgeAmount,
    receivedAmount,
    availableBalance,

    // Token loading state
    isLoadingTokens,
    tokensError,
    userTokens,

    // Balance data
    balance,

    // UI helpers
    formatNumber,
    handleInputChange,
    handleMaxButtonClick,
    handleTokenSelect,
  };
}
