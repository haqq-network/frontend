import { defineChain } from 'viem';
import { mainnet as mainnetChain } from 'viem/chains';

/**
 * Custom Ethereum mainnet chain config.
 * Uses custom RPC URLs instead of viem's default (eth.merkle.io) to avoid
 * CORS and merkle provider issues (browser and OP Stack / bridge flows).
 */
export const mainnet = defineChain({
  ...mainnetChain,
  rpcUrls: {
    default: {
      http: [
        'https://ethereum.publicnode.com',
        'https://eth.drpc.org',
        'https://eth.api.onfinality.io/public',
        'https://0xrpc.io/eth',
        'https://mainnet.gateway.tenderly.co',
        'https://api.zan.top/eth-mainnet',
        'https://eth.meowrpc.com',
        'https://ethereum-public.nodies.app',
        'https://ethereum.rpc.subquery.network/public',
        'https://rpc.eth.gateway.fm',
        'https://rpc.flashbots.net',
        'https://eth.rpc.blxrbdn.com',
        'https://eth1.lava.build',
      ],
    },
  },
});
