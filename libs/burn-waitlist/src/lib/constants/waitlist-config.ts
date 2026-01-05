import { haqqTestethiq, haqqEthiq } from '@haqq/shell-shared';

/**
 * Waitlist contract addresses mapped by chain ID
 * Key: chain ID, Value: contract address
 */
export const WAITLIST_CONTRACT_ADDRESSES: Record<number, `0x${string}`> = {
  [haqqTestethiq.id]:
    '0xAFb74983668ff5cBE7340cb0DA014D7221c7947e' as `0x${string}`,
  // Add more chain deployments here as they become available
  // [haqqEthiq.id]: '0x...' as `0x${string}`,
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
export const WAITLIST_DEFAULT_CHAIN_ID =
  WAITLIST_SUPPORTED_CHAIN_IDS[0] || haqqTestethiq.id;

/**
 * Backend API base URL
 * Can be overridden via environment variable
 */
export const getBackendApiUrl = (): string => {
  if (typeof window !== 'undefined') {
    return (
      process.env.NEXT_PUBLIC_BURN_WAITLIST_API_URL || 'http://localhost:8080'
    );
  }
  return process.env.BURN_WAITLIST_API_URL || 'http://localhost:8080';
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
