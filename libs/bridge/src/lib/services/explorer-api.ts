/**
 * HAQQ Explorer API service for fetching user token balances
 * Uses Next.js API routes as proxy to avoid CORS issues
 */

// These interfaces are no longer needed since we're using the proxy API
// but keeping them for potential future use

export interface TokenBalance {
  symbol: string;
  address: string;
  name: string;
  balance: string; // Balance in wei
  decimals: number;
  formattedBalance: number; // Balance in human-readable format
}

/**
 * Makes a request to our Next.js API proxy
 */
async function makeProxyRequest(
  endpoint: string,
  params: Record<string, string>,
): Promise<any> {
  const searchParams = new URLSearchParams(params);
  const url = `/api/tokens/${endpoint}?${searchParams.toString()}`;

  console.log(`Making proxy API request to: ${url}`);

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => {
      return {};
    });
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`,
    );
  }

  const data = await response.json();
  console.log(`Proxy API response received:`, data);
  return data;
}

/**
 * Fetches user token balances via Next.js API proxy
 */
export async function fetchUserTokenBalances(
  address: string,
  chainId: number,
): Promise<TokenBalance[]> {
  try {
    console.log(
      `Fetching token balances for address ${address} on chain ${chainId}`,
    );

    const data = await makeProxyRequest('balances', {
      address,
      chainId: chainId.toString(),
    });

    console.log(`Found ${data.tokens.length} tokens with non-zero balance`);
    console.log(`Processed token balances:`, data.tokens);

    return data.tokens;
  } catch (error) {
    console.error('Failed to fetch token balances:', error);
    throw error;
  }
}

/**
 * Fetches native token balance via Next.js API proxy using RPC
 */
export async function fetchNativeTokenBalance(
  address: string,
  chainId: number,
): Promise<TokenBalance | null> {
  try {
    console.log(
      `Fetching native token balance for address ${address} on chain ${chainId}`,
    );

    const data = await makeProxyRequest('native-balance', {
      address,
      chainId: chainId.toString(),
    });

    if (data.token) {
      console.log(
        `Native token balance: ${data.token.formattedBalance} ${data.token.symbol}`,
      );
      return data.token;
    } else {
      console.log('No native token balance found:', data.message);
      return null;
    }
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

