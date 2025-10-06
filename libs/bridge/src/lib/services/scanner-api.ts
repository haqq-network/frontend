/**
 * Scanner API service for retrieving token pair information
 * Base URL: https://scanner.dev.haqq.network
 */

import { sepolia } from 'viem/chains';
import { haqqDevnet1 } from '@haqq/shell-shared';

const SCANNER_API_BASE_URL = 'https://scanner.dev.haqq.network/api/v1';

export interface TokenPair {
  id: number;
  source_token: string;
  target_token: string;
  source_chain: string;
  target_chain: string;
  bridge_type: string;
  created_at: string;
  updated_at: string;
}

export interface TokenPairsResponse {
  count: number;
  data: TokenPair[];
}

export interface TokenPairResponse {
  data: TokenPair;
}

export interface ScannerApiError {
  error: string;
}

/**
 * Get all token pairs from the scanner API
 */
export async function getAllTokenPairs(): Promise<TokenPairsResponse> {
  const response = await fetch(`${SCANNER_API_BASE_URL}/token-pairs`);

  if (!response.ok) {
    const error: ScannerApiError = await response.json();
    throw new Error(`Scanner API error: ${error.error || 'Unknown error'}`);
  }

  return response.json();
}

/**
 * Get a specific token pair by ID
 */
export async function getTokenPairById(id: number): Promise<TokenPairResponse> {
  const response = await fetch(`${SCANNER_API_BASE_URL}/token-pairs/${id}`);

  if (!response.ok) {
    const error: ScannerApiError = await response.json();
    throw new Error(`Scanner API error: ${error.error || 'Unknown error'}`);
  }

  return response.json();
}

/**
 * Find token pairs by token address
 * @param tokenAddress - Token contract address to search for
 * @param chain - Optional chain name filter
 */
export async function findTokenPairsByAddress(
  tokenAddress: string,
  chain?: string,
): Promise<TokenPairsResponse> {
  const url = new URL(
    `${SCANNER_API_BASE_URL}/token-pairs/find/${tokenAddress}`,
  );

  if (chain) {
    url.searchParams.set('chain', chain);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    const error: ScannerApiError = await response.json();
    throw new Error(`Scanner API error: ${error.error || 'Unknown error'}`);
  }

  return response.json();
}

/**
 * Get the remote token address for a given local token address
 * @param localTokenAddress - The local token address
 * @param sourceChain - The source chain name (e.g., 'Sepolia')
 * @param targetChain - The target chain name (e.g., 'HAQQ')
 * @returns The remote token address or null if not found
 */
export async function getRemoteTokenAddress(
  localTokenAddress: string,
  sourceChain: string,
  targetChain: string,
): Promise<string | null> {
  try {
    // First, try to find pairs with the local token on the source chain
    const response = await findTokenPairsByAddress(
      localTokenAddress,
      sourceChain,
    );

    console.log('response', response);
    // Look for a pair that bridges from sourceChain to targetChain
    const matchingPair = response.data.find((pair) => {
      return (
        pair.source_chain.toLowerCase() === sourceChain.toLowerCase() &&
        pair.target_chain.toLowerCase() === targetChain.toLowerCase() &&
        pair.source_token.toLowerCase() === localTokenAddress.toLowerCase()
      );
    });

    if (matchingPair) {
      return matchingPair.target_token;
    }

    // Also check if the token might be the target token in a reverse pair
    const reversePair = response.data.find((pair) => {
      return (
        pair.source_chain.toLowerCase() === targetChain.toLowerCase() &&
        pair.target_chain.toLowerCase() === sourceChain.toLowerCase() &&
        pair.target_token.toLowerCase() === localTokenAddress.toLowerCase()
      );
    });

    if (reversePair) {
      return reversePair.source_token;
    }

    return null;
  } catch (error) {
    console.error(
      'Error fetching remote token address from scanner API:',
      error,
    );
    return null;
  }
}

/**
 * Get chain name from chain ID
 * @param chainId - The chain ID
 * @returns The chain name for the scanner API
 */
export function getChainNameFromId(chainId: number): string {
  switch (chainId) {
    case sepolia.id: // Sepolia
      return 'Sepolia';
    case haqqDevnet1.id: // HAQQ L2
      return 'HAQQ';
    default:
      throw new Error(`Unsupported chain ID: ${chainId}`);
  }
}
