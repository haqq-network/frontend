import { haqqMainnet, haqqTestedge2 } from 'viem/chains';

/**
 * Waitlist contract addresses mapped by chain ID
 * Key: chain ID, Value: contract address
 */
export const WAITLIST_CONTRACT_ADDRESSES: Record<number, `0x${string}`> = {
  [haqqMainnet.id]:
    '0xe974fc272bA869E638f402e2818161EB88b2A392' as `0x${string}`,
  [haqqTestedge2.id]:
    '0xeCad76E45BcD709B6c1662397FBbb890C684a9aB' as `0x${string}`,
  // Add more chain deployments here as they become available
};

/**
 * Supported chain IDs for waitlist
 */
export const WAITLIST_SUPPORTED_CHAIN_IDS = Object.keys(
  WAITLIST_CONTRACT_ADDRESSES,
).map(Number);

/**
 * Get waitlist contract address for a given chain ID
 * @param chainId - The chain ID to get the contract address for
 * @returns The contract address for the chain, or undefined if not supported
 */
export function getWaitlistContractAddress(
  chainId?: number,
): `0x${string}` | undefined {
  if (!chainId) {
    return undefined;
  }
  return WAITLIST_CONTRACT_ADDRESSES[chainId];
}

/**
 * Check if a chain ID is supported for waitlist
 * @param chainId - The chain ID to check
 * @returns True if the chain is supported
 */
export function isWaitlistChainSupported(chainId?: number): boolean {
  if (!chainId) {
    return false;
  }
  return chainId in WAITLIST_CONTRACT_ADDRESSES;
}

/**
 * Default chain ID for waitlist (first supported chain)
 */

// TODO: Change to mainnet when ready
export const WAITLIST_DEFAULT_CHAIN_ID = haqqTestedge2.id;

/**
 * Backend API base URL
 * @param chainId - Optional chain ID to determine which backend URL to use
 * @returns Backend API URL for the specified chain
 */
export const getBackendApiUrl = (chainId?: number): string => {
  // Return chain-specific URL based on chain ID
  if (chainId === haqqMainnet.id) {
    return 'https://waitlist.haqq.network';
  }

  // Default to production URL for testnet or unknown chains
  return 'https://waitlist.vorobevsa.com';
};

/**
 * Funds source enum values
 */
export enum FundsSource {
  OwnBalance = 0,
  ucDAO = 1,
}

/**
 * Request state enum values
 */
export enum RequestsState {
  Initialed = 0,
  Started = 1,
  Closed = 2,
  Finalized = 3,
}
