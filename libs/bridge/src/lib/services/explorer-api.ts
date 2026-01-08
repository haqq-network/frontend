/**
 * HAQQ Explorer API service for fetching user token balances and withdrawals
 * Uses Next.js API routes as proxy to avoid CORS issues for token balances
 * Direct API calls for withdrawals endpoint
 */

import { haqqEthiq, haqqTestethiq } from '@haqq/shell-shared';
import { WithdrawalStatus } from '../types/withdrawal-order';

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
 * Explorer API withdrawal response types
 */
export interface ExplorerWithdrawalAddress {
  ens_domain_name: string | null;
  hash: string;
  implementations: unknown[];
  is_contract: boolean;
  is_scam: boolean;
  is_verified: boolean;
  metadata: unknown | null;
  name: string | null;
  private_tags: unknown[];
  proxy_type: string | null;
  public_tags: unknown[];
  watchlist_names: unknown[];
}

export interface ExplorerWithdrawal {
  challenge_period_end: string | null;
  from: ExplorerWithdrawalAddress;
  l1_transaction_hash: string | null;
  l2_timestamp: string;
  l2_transaction_hash: string;
  msg_nonce: number;
  msg_nonce_raw: string;
  msg_nonce_version: number;
  status: string;
}

export interface ExplorerWithdrawalsResponse {
  items: ExplorerWithdrawal[];
  next_page_params: {
    index?: number;
    items_count?: number;
  } | null;
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

    const erc20Tokens = await fetchUserTokenBalances(address, chainId);

    console.log(`ERC-20 tokens found: ${erc20Tokens.length}`);

    const allTokens = [...erc20Tokens];

    console.log(`Total tokens to return: ${allTokens.length}`);
    return allTokens;
  } catch (error) {
    console.error('Failed to fetch all token balances:', error);
    throw error;
  }
}

/**
 * Maps explorer API status string to WithdrawalStatus enum
 * @param explorerStatus - Status string from explorer API
 * @returns Mapped WithdrawalStatus
 */
export function mapExplorerStatusToWithdrawalStatus(
  explorerStatus: string,
): WithdrawalStatus {
  const statusLower = explorerStatus.toLowerCase();

  // Map common explorer status strings to our status enum
  if (statusLower.includes('waiting') || statusLower.includes('game')) {
    // "Waiting a game to resolve" or similar - withdrawal is initiated but not yet proved
    return WithdrawalStatus.INITIATED;
  }
  if (statusLower.includes('proving') || statusLower.includes('challenge')) {
    return WithdrawalStatus.PROVING;
  }
  if (statusLower.includes('proved') || statusLower.includes('ready')) {
    return WithdrawalStatus.PROVED;
  }
  if (statusLower.includes('finalizing')) {
    return WithdrawalStatus.FINALIZING;
  }
  if (statusLower.includes('finalized') || statusLower.includes('completed')) {
    return WithdrawalStatus.FINALIZED;
  }
  if (statusLower.includes('failed') || statusLower.includes('error')) {
    return WithdrawalStatus.FAILED;
  }

  // Default to initiated if status is unknown
  console.warn(
    `Unknown explorer status: ${explorerStatus}, defaulting to INITIATED`,
  );
  return WithdrawalStatus.INITIATED;
}

/**
 * Gets the explorer API base URL based on chain ID
 * @param chainId - Chain ID to determine which explorer to use
 * @returns Base URL for the explorer API
 */
function getExplorerApiUrl(chainId: number): string {
  // Check if it's testnet (testethiq)
  if (chainId === haqqTestethiq.id) {
    return 'https://explorer.testnet.ethiq.network/api/v2/optimism/withdrawals';
  }

  // Default to mainnet (ethiq)
  return 'https://explorer.ethiq.network/api/v2/optimism/withdrawals';
}

/**
 * Fetches a single page of withdrawals from the explorer API
 * @param address - User address to fetch withdrawals for
 * @param chainId - Chain ID to determine which explorer to use
 * @param page - Optional page parameter for pagination
 * @returns Withdrawals response from explorer API
 */
export async function fetchWithdrawalsPage(
  address: string,
  chainId: number,
  page?: { index?: number; items_count?: number },
): Promise<ExplorerWithdrawalsResponse> {
  try {
    const baseUrl = getExplorerApiUrl(chainId);
    const url = new URL(baseUrl);

    // Add address filter if provided
    url.searchParams.set('address', address);

    // Add pagination params if provided
    if (page?.index !== undefined) {
      url.searchParams.set('index', page.index.toString());
    }
    if (page?.items_count !== undefined) {
      url.searchParams.set('items_count', page.items_count.toString());
    }

    console.log(
      `Fetching withdrawals page from explorer API: ${url.toString()}`,
    );

    const response = await fetch(url.toString(), {
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

    const data: ExplorerWithdrawalsResponse = await response.json();
    console.log(`Found ${data.items.length} withdrawals in this page`);
    return data;
  } catch (error) {
    console.error('Failed to fetch withdrawals from explorer API:', error);
    throw error;
  }
}

/**
 * Fetches withdrawals from the explorer API (single page)
 * @param address - User address to fetch withdrawals for
 * @param chainId - Chain ID to determine which explorer to use
 * @returns Withdrawals from the first page
 */
export async function fetchWithdrawals(
  address: string,
  chainId: number,
): Promise<ExplorerWithdrawal[]> {
  try {
    const response = await fetchWithdrawalsPage(address, chainId);
    console.log(
      `Fetched ${response.items.length} withdrawals from explorer API`,
    );
    return response.items;
  } catch (error) {
    console.error('Failed to fetch withdrawals from explorer API:', error);
    throw error;
  }
}
