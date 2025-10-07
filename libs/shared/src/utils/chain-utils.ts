import { sepolia } from 'viem/chains';
import { haqqTestethic } from './bridge';

// Supported chains for bridge operations
export const SUPPORTED_CHAINS = [sepolia, haqqTestethic];

/**
 * Get chain configuration by chain ID
 */
export function getChainById(chainId: number) {
  return (
    SUPPORTED_CHAINS.find((chain) => {
      return chain.id === chainId;
    }) || null
  );
}

/**
 * Check if a chain ID is supported
 */
export function isChainSupported(chainId: number): boolean {
  return SUPPORTED_CHAINS.some((chain) => {
    return chain.id === chainId;
  });
}

/**
 * Get chain name by chain ID
 */
export function getChainName(chainId: number): string {
  const chain = getChainById(chainId);
  return chain?.name || `Chain ${chainId}`;
}
