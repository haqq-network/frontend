import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http, formatEther, Chain } from 'viem';
import { haqqMainnet, haqqTestedge2, sepolia } from 'viem/chains';
import { haqqEthiq, haqqTestethiq, mainnet } from '@haqq/shell-shared';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const chainId = searchParams.get('chainId');

    if (!address || !chainId) {
      return NextResponse.json(
        { error: 'Missing required parameters: address and chainId' },
        { status: 400 },
      );
    }

    // Get chain configuration
    const chainConfig = getChainConfig(parseInt(chainId));
    if (!chainConfig) {
      return NextResponse.json(
        { error: `Unsupported chain ID: ${chainId}` },
        { status: 400 },
      );
    }

    // Create RPC client for the chain
    const client = createPublicClient({
      chain: chainConfig.chain,
      transport: http(chainConfig.rpcUrl),
    });

    try {
      // Get native token balance using RPC
      const balance = await client.getBalance({
        address: address as `0x${string}`,
      });

      const formattedBalance = parseFloat(formatEther(balance));

      const nativeToken = {
        symbol: chainConfig.nativeSymbol,
        address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', // ETH placeholder
        name: chainConfig.nativeName,
        balance: balance.toString(),
        decimals: 18,
        formattedBalance,
      };

      return NextResponse.json({
        token: nativeToken,
      });
    } catch {
      return NextResponse.json(
        { error: 'Failed to fetch native token balance via RPC' },
        { status: 500 },
      );
    }
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

interface ChainConfig {
  chain: Chain;
  rpcUrl: string;
  nativeSymbol: string;
  nativeName: string;
}

function getChainConfig(chainId: number): ChainConfig | null {
  const configs: Record<number, ChainConfig> = {
    [haqqTestethiq.id]: {
      chain: haqqTestethiq,
      rpcUrl: haqqTestethiq.rpcUrls.default.http[0],
      nativeSymbol: 'ETH',
      nativeName: 'Ethereum',
    },
    [haqqEthiq.id]: {
      chain: haqqEthiq,
      rpcUrl: haqqEthiq.rpcUrls.default.http[0],
      nativeSymbol: 'ETH',
      nativeName: 'Ethereum',
    },
    [sepolia.id]: {
      chain: sepolia,
      rpcUrl: sepolia.rpcUrls.default.http[0],
      nativeSymbol: 'ETH',
      nativeName: 'Ethereum',
    },
    [haqqMainnet.id]: {
      chain: haqqMainnet,
      rpcUrl: haqqMainnet.rpcUrls.default.http[0],
      nativeSymbol: 'ISLM',
      nativeName: 'Islamic Coin',
    },
    [haqqTestedge2.id]: {
      chain: haqqTestedge2,
      rpcUrl: haqqTestedge2.rpcUrls.default.http[0],
      nativeSymbol: 'ISLM',
      nativeName: 'Islamic Coin',
    },
    [mainnet.id]: {
      chain: mainnet,
      rpcUrl: mainnet.rpcUrls.default.http[0],
      nativeSymbol: 'ETH',
      nativeName: 'Ethereum',
    },
  };

  return configs[chainId] || null;
}
