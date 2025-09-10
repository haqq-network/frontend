'use client';

import { useCallback, useMemo, useState } from 'react';
import { formatUnits } from 'viem';
import { useAccount, useBalance } from 'wagmi';
import { SWAPPABLE_TOKENS } from '@haqq/shell-shared';
import { useTokenBalances } from './use-token-balances';

interface Token {
  symbol: string;
  address: string;
  name?: string;
  balance?: string;
  decimals?: number;
  formattedBalance?: number;
}

const ETH_TOKEN = {
  symbol: 'ETH',
  address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  name: 'Ethereum',
};

interface UseBridgeStateReturn {
  // Account state
  address: string | undefined;
  chain: any;
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
 */
export function useBridgeState(): UseBridgeStateReturn {
  const { address, chain, isConnected } = useAccount();

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

  return {
    // Account state
    address,
    chain,
    isConnected,

    // Token state
    availableTokens,
    selectedToken,
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
