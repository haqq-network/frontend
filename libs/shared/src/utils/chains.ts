import { haqqMainnet, haqqTestedge2, mainnet, sepolia } from 'viem/chains';
import { haqqEthiq } from './bridge';
import { haqqTestethiq } from './bridge-testethiq';

export const bridgeSupportedChains = [
  haqqTestethiq,
  sepolia,
  haqqEthiq,
  mainnet,
];
export const faucetSupportedChains = [haqqTestethiq, haqqTestedge2];

export const baseSupportedChains = [haqqMainnet, haqqTestedge2] as const;

export const supportedChains = [
  ...baseSupportedChains,
  ...bridgeSupportedChains,
] as const;
