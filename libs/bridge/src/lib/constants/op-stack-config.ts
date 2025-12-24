import { mainnet, sepolia } from 'viem/chains';
import { haqqEthiq, haqqTestethiq } from '@haqq/shell-shared';

/**
 * Chain configurations for OP Stack operations
 */
export const OP_STACK_TESTNET_CHAINS = {
  L1: sepolia,
  L2: haqqTestethiq,
  L2_WITH_CONTRACTS: { ...haqqTestethiq },
} as const;

export const OP_STACK_MAINNET_CHAINS = {
  L1: mainnet,
  L2: haqqEthiq,
  L2_WITH_CONTRACTS: { ...haqqEthiq },
} as const;

export const getOpStackChains = (chainId?: number) => {
  if (chainId === sepolia.id) {
    return OP_STACK_TESTNET_CHAINS;
  } else if (chainId === mainnet.id) {
    return OP_STACK_MAINNET_CHAINS;
  } else if (chainId === haqqEthiq.id) {
    return OP_STACK_MAINNET_CHAINS;
  } else if (chainId === haqqTestethiq.id) {
    return OP_STACK_TESTNET_CHAINS;
  }
  return OP_STACK_TESTNET_CHAINS;
};
