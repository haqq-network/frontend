import { haqqMainnet, haqqTestedge2, sepolia } from 'viem/chains';
import { haqqTestethic } from './bridge';

export const bridgeSupportedChains = [haqqTestethic, sepolia];

export const baseSupportedChains = [haqqMainnet, haqqTestedge2] as const;

export const supportedChains = [
  ...baseSupportedChains,
  ...bridgeSupportedChains,
] as const;
