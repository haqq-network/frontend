import { haqqMainnet, haqqTestedge2, sepolia } from 'viem/chains';
import { haqqTestethiq } from './bridge';

export const bridgeSupportedChains = [haqqTestethiq, sepolia];
export const faucetSupportedChains = [haqqTestedge2, haqqTestethiq];

export const baseSupportedChains = [haqqMainnet, haqqTestedge2] as const;

export const supportedChains = [
  ...baseSupportedChains,
  ...bridgeSupportedChains,
] as const;
