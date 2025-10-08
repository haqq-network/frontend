import { NextRequest, NextResponse } from 'next/server';
import { haqqMainnet, haqqTestedge2, sepolia } from 'viem/chains';
import { haqqTestethiq } from '@haqq/shell-shared';

export interface TokenBalance {
  symbol: string;
  address: string;
  name: string;
  balance: string;
  decimals: number;
  formattedBalance: number;
}

export interface ExplorerToken {
  value: string;
  token: {
    symbol: string;
    address_hash?: string;
    address?: string;
    name: string;
    decimals: string;
  };
}

export interface ExplorerApiResponse {
  items: ExplorerToken[];
}

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
    const chainConfig = getChainConfig(Number(chainId));
    if (!chainConfig) {
      return NextResponse.json(
        { error: `Unsupported chain ID: ${chainId}` },
        { status: 400 },
      );
    }

    // Make the API request to the explorer
    const url = `${chainConfig.apiUrl}/v2/addresses/${address}/tokens?type=ERC-20`;

    console.log('Explorer API URL:', url);

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    console.log('Explorer API response status:', response.status);

    if (!response.ok) {
      console.log('Explorer API error:', response.status, response.statusText);

      return NextResponse.json(
        {
          error: `Explorer API error: ${response.status} ${response.statusText}`,
        },
        { status: response.status },
      );
    }

    const data = (await response.json()) as ExplorerApiResponse;

    console.log('Explorer API data items count:', data.items?.length || 0);

    // Filter out tokens with zero balance
    const filteredTokens: ExplorerToken[] = data.items.filter((item) => {
      return item.value !== '0' && item.value !== '0x0';
    });

    console.log(
      `Found ${filteredTokens.length} tokens with non-zero balance out of ${data.items.length} total tokens`,
    );

    // Process token balances
    const tokenBalances: TokenBalance[] = filteredTokens.map((item) => {
      const decimals = Number(item.token.decimals);
      const balanceWei = BigInt(item.value);
      const formattedBalance = Number(balanceWei) / Math.pow(10, decimals);

      return {
        symbol: item.token.symbol,
        address: item.token.address_hash || item.token.address || '',
        name: item.token.name,
        balance: item.value,
        decimals,
        formattedBalance,
      };
    });

    console.log(
      'Processed token balances:',
      tokenBalances.map((t) => {
        return `${t.symbol}: ${t.formattedBalance}`;
      }),
    );

    return NextResponse.json({
      tokens: tokenBalances,
      total: filteredTokens.length,
    });
  } catch (error) {
    console.error('Error in token balances API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

interface ChainConfig {
  apiUrl: string;
  nativeSymbol: string;
  nativeName: string;
}

function getChainConfig(chainId: number): ChainConfig | null {
  const configs: Record<number, ChainConfig> = {
    [haqqTestethiq.id]: {
      // HAQQ Devnet1
      apiUrl: haqqTestethiq.blockExplorers.default.apiUrl,
      nativeSymbol: 'ISLM',
      nativeName: 'Islamic Coin',
    },
    [sepolia.id]: {
      // Sepolia
      apiUrl: 'https://eth-sepolia.blockscout.com/api',
      nativeSymbol: 'ETH',
      nativeName: 'Ethereum',
    },
    [haqqMainnet.id]: {
      // HAQQ Mainnet
      apiUrl: haqqMainnet.blockExplorers.default.apiUrl,
      nativeSymbol: 'ISLM',
      nativeName: 'Islamic Coin',
    },
    [haqqTestedge2.id]: {
      // HAQQ Testedge2
      apiUrl: haqqTestedge2.blockExplorers.default.apiUrl,
      nativeSymbol: 'ISLM',
      nativeName: 'Islamic Coin',
    },
  };

  return configs[chainId] || null;
}
