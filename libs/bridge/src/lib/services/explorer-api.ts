/**
 * HAQQ Explorer API service for fetching user token balances
 */

import { haqqMainnet, haqqTestedge2, sepolia } from 'viem/chains';
import { haqqDevnet1 } from '@haqq/shell-shared';

export interface ExplorerToken {
  address: string;
  circulating_market_cap: string | null;
  decimals: string;
  exchange_rate: string | null;
  holders: string;
  icon_url: string | null;
  name: string;
  symbol: string;
  total_supply: string;
  type: string;
  volume_24h: string | null;
}

export interface ExplorerTokenBalance {
  token: ExplorerToken;
  token_id: string | null;
  token_instance: string | null;
  value: string; // Balance in wei
}

export interface ExplorerApiResponse {
  items: ExplorerTokenBalance[];
  next_page_params: string | null;
}

export interface TokenBalance {
  symbol: string;
  address: string;
  name: string;
  balance: string; // Balance in wei
  decimals: number;
  formattedBalance: number; // Balance in human-readable format
}

interface ChainConfig {
  apiUrl: string;
  nativeSymbol: string;
  nativeName: string;
}

/**
 * Gets chain configuration for supported networks
 */
function getChainConfig(chainId: number): ChainConfig | null {
  const configs: Record<number, ChainConfig> = {
    [haqqDevnet1.id]: {
      apiUrl: `${haqqDevnet1.blockExplorers.default.apiUrl}/v2`,
      nativeSymbol: 'ISLMT',
      nativeName: 'Islamic Coin',
    },
    [sepolia.id]: {
      apiUrl: sepolia.blockExplorers.default.apiUrl,
      nativeSymbol: 'ETH',
      nativeName: 'Ethereum',
    },
    [haqqMainnet.id]: {
      apiUrl: `${haqqMainnet.blockExplorers.default.apiUrl}/v2`,
      nativeSymbol: 'ISLMT',
      nativeName: 'Islamic Coin',
    },
    [haqqTestedge2.id]: {
      apiUrl: `${haqqTestedge2.blockExplorers.default.apiUrl}/v2`,
      nativeSymbol: 'ISLMT',
      nativeName: 'Islamic Coin',
    },
  };

  return configs[chainId] || null;
}

/**
 * Makes an API request with error handling
 */
async function makeApiRequest(url: string): Promise<any> {
  console.log(`Making API request to: ${url}`);

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log(`API response received:`, data);
  return data;
}

/**
 * Fetches user token balances from HAQQ Explorer API
 */
export async function fetchUserTokenBalances(
  address: string,
  chainId: number,
): Promise<TokenBalance[]> {
  try {
    console.log(
      `Fetching token balances for address ${address} on chain ${chainId}`,
    );

    const chainConfig = getChainConfig(chainId);
    if (!chainConfig) {
      console.log(`Unsupported chain ID: ${chainId}, returning empty array`);
      return [];
    }

    const url = `${chainConfig.apiUrl}/addresses/${address}/tokens?type=ERC-20`;
    const data: ExplorerApiResponse = await makeApiRequest(url);

    const filteredTokens = data.items.filter((item) => {
      // Filter out tokens with zero balance
      return item.value !== '0' && item.value !== '0x0';
    });

    console.log(
      `Found ${filteredTokens.length} tokens with non-zero balance out of ${data.items.length} total tokens`,
    );

    const tokenBalances = filteredTokens.map((item) => {
      const decimals = parseInt(item.token.decimals, 10);
      const balanceWei = BigInt(item.value);
      const formattedBalance = Number(balanceWei) / Math.pow(10, decimals);

      return {
        symbol: item.token.symbol,
        address: item.token.address,
        name: item.token.name,
        balance: item.value,
        decimals,
        formattedBalance,
      };
    });

    console.log(`Processed token balances:`, tokenBalances);
    return tokenBalances;
  } catch (error) {
    console.error('Failed to fetch token balances:', error);
    throw error;
  }
}

/**
 * Fetches native token balance (ETH/ISLMT) for a given address
 */
export async function fetchNativeTokenBalance(
  address: string,
  chainId: number,
): Promise<TokenBalance | null> {
  try {
    console.log(
      `Fetching native token balance for address ${address} on chain ${chainId}`,
    );

    const chainConfig = getChainConfig(chainId);
    if (!chainConfig) {
      console.log(`Unsupported chain ID for native token: ${chainId}`);
      return null;
    }

    // Currently only HAQQ Devnet1 supports native token balance API
    if (chainId !== haqqDevnet1.id) {
      return null;
    }

    const url = `${chainConfig.apiUrl}/addresses/${address}`;
    const data = await makeApiRequest(url);

    if (data.coin_balance) {
      const balanceWei = BigInt(data.coin_balance);
      const formattedBalance = Number(balanceWei) / Math.pow(10, 18);

      console.log(
        `Native token balance: ${formattedBalance} ${chainConfig.nativeSymbol}`,
      );

      return {
        symbol: chainConfig.nativeSymbol,
        address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', // ETH placeholder
        name: chainConfig.nativeName,
        balance: data.coin_balance,
        decimals: 18,
        formattedBalance,
      };
    } else {
      console.log('No native token balance found in API response');
    }

    return null;
  } catch (error) {
    console.error('Failed to fetch native token balance:', error);
    return null;
  }
}

/**
 * Combines native and ERC-20 token balances
 */
export async function fetchAllTokenBalances(
  address: string,
  chainId: number,
): Promise<TokenBalance[]> {
  try {
    console.log(
      `Fetching all token balances for address ${address} on chain ${chainId}`,
    );

    const [erc20Tokens, nativeToken] = await Promise.all([
      fetchUserTokenBalances(address, chainId),
      fetchNativeTokenBalance(address, chainId),
    ]);

    console.log(`ERC-20 tokens found: ${erc20Tokens.length}`);
    console.log(`Native token found: ${nativeToken ? 'Yes' : 'No'}`);

    const allTokens = [...erc20Tokens];

    if (nativeToken && nativeToken.formattedBalance > 0) {
      console.log(
        `Adding native token with balance: ${nativeToken.formattedBalance} ${nativeToken.symbol}`,
      );
      allTokens.unshift(nativeToken);
    } else if (nativeToken) {
      console.log(`Native token has zero balance, not adding to list`);
    }

    console.log(`Total tokens to return: ${allTokens.length}`);
    return allTokens;
  } catch (error) {
    console.error('Failed to fetch all token balances:', error);
    throw error;
  }
}
