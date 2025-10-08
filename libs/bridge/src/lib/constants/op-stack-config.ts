import { sepolia } from 'viem/chains';
import { haqqTestethiq } from '@haqq/shell-shared';

/**
 * OP Stack compatible chain configuration for HAQQ Devnet
 * This configuration includes the necessary contracts for OP Stack operations
 */
export const haqqTestethiqWithContracts = {
  ...haqqTestethiq,
};

/**
 * Chain configurations for OP Stack operations
 */
export const OP_STACK_CHAINS = {
  L1: sepolia,
  L2: haqqTestethiq,
  L2_WITH_CONTRACTS: haqqTestethiqWithContracts,
} as const;
