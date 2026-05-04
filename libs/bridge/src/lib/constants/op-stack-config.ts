import { sepolia } from 'viem/chains';
import { haqqDevnet2, haqqEthiq, haqqTestethiq } from '@haqq/shell-shared';
import { mainnet } from './mainnet';

/**
 * Chain configurations for OP Stack operations
 */
export const OP_STACK_TESTNET_CHAINS = {
  L1: sepolia,
  L2: haqqTestethiq,
  L2_WITH_CONTRACTS: { ...haqqTestethiq },
} as const;

export const OP_STACK_DEVNET2_CHAINS = {
  L1: sepolia,
  L2: haqqDevnet2,
  L2_WITH_CONTRACTS: { ...haqqDevnet2 },
} as const;

export const OP_STACK_MAINNET_CHAINS = {
  L1: mainnet,
  L2: haqqEthiq,
  L2_WITH_CONTRACTS: { ...haqqEthiq },
} as const;

/**
 * Returns the OP Stack chain pair (L1 + L2) for the given source chain.
 *
 * When the source is sepolia, multiple L2s share the same L1 — pass
 * `targetL2ChainId` to disambiguate. Defaults to Testethiq otherwise.
 */
export const getOpStackChains = (
  chainId?: number,
  targetL2ChainId?: number,
) => {
  if (chainId === sepolia.id) {
    if (targetL2ChainId === haqqDevnet2.id) {
      return OP_STACK_DEVNET2_CHAINS;
    }
    return OP_STACK_TESTNET_CHAINS;
  } else if (chainId === mainnet.id) {
    return OP_STACK_MAINNET_CHAINS;
  } else if (chainId === haqqEthiq.id) {
    return OP_STACK_MAINNET_CHAINS;
  } else if (chainId === haqqTestethiq.id) {
    return OP_STACK_TESTNET_CHAINS;
  } else if (chainId === haqqDevnet2.id) {
    return OP_STACK_DEVNET2_CHAINS;
  }
  return OP_STACK_TESTNET_CHAINS;
};
