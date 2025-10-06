import { sepolia } from 'viem/chains';
import { haqqTestethic } from '@haqq/shell-shared';

/**
 * OP Stack compatible chain configuration for HAQQ Devnet
 * This configuration includes the necessary contracts for OP Stack operations
 */
export const haqqTestethicWithContracts = {
  ...haqqTestethic,
};

/**
 * Chain configurations for OP Stack operations
 */
export const OP_STACK_CHAINS = {
  L1: sepolia,
  L2: haqqTestethic,
  L2_WITH_CONTRACTS: haqqTestethicWithContracts,
} as const;
