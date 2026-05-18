import { haqqMainnet, haqqTestedge2, sepolia } from 'viem/chains';
import { haqqEthiq } from './bridge';
import { haqqDevnet2 } from './bridge-devnet';
import { haqqTestethiq } from './bridge-testethiq';
import { mainnet } from './ethereum-mainnet';

export const bridgeSupportedChains = [
  haqqTestethiq,
  haqqDevnet2,
  sepolia,
  haqqEthiq,
  mainnet,
];
export const faucetSupportedChains = [
  haqqTestethiq,
  haqqDevnet2,
  haqqTestedge2,
];

export const baseSupportedChains = [haqqMainnet, haqqTestedge2] as const;

export const supportedChains = [
  ...baseSupportedChains,
  ...bridgeSupportedChains,
] as const;
