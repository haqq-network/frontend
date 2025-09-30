import { sepolia } from 'viem/chains';
import { haqqDevnet1 } from '@haqq/shell-shared';

/**
 * OP Stack compatible chain configuration for HAQQ Devnet
 * This configuration includes the necessary contracts for OP Stack operations
 */
export const haqqDevnet1WithContracts = {
  ...haqqDevnet1,
};

/**
 * Chain configurations for OP Stack operations
 */
export const OP_STACK_CHAINS = {
  L1: sepolia,
  L2: haqqDevnet1,
  L2_WITH_CONTRACTS: haqqDevnet1WithContracts,
} as const;
