import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http, formatEther, Chain } from 'viem';
import { haqqMainnet, haqqTestedge2, sepolia } from 'viem/chains';
import { haqqEthiq, haqqTestethiq, mainnet } from '@haqq/shell-shared';

// Mark route as dynamic since it uses request.url
export const dynamic = 'force-dynamic';

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
    //
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

    // Check if native token (0xeee...) is already in results
    const NATIVE_TOKEN_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
    const hasNativeToken = tokenBalances.some((token) => {
      return token.address.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase();
    });

    // If native token is not in results, fetch and add it
    if (!hasNativeToken) {
      try {
        const chainConfigWithRpc = getChainConfigWithRpc(Number(chainId));
        if (chainConfigWithRpc) {
          const client = createPublicClient({
            chain: chainConfigWithRpc.chain,
            transport: http(chainConfigWithRpc.rpcUrl),
          });

          const balance = await client.getBalance({
            address: address as `0x${string}`,
          });

          const formattedBalance = parseFloat(formatEther(balance));

          // Only add native token if balance is greater than 0
          const nativeToken: TokenBalance = {
            symbol: chainConfigWithRpc.nativeSymbol,
            address: NATIVE_TOKEN_ADDRESS,
            name: chainConfigWithRpc.nativeName,
            balance: balance.toString(),
            decimals: 18,
            formattedBalance,
          };

          // Add native token at the beginning of the array
          tokenBalances.unshift(nativeToken);
        }
      } catch (error) {
        console.error('Failed to fetch native token balance:', error);
        // Continue without native token if fetch fails
      }
    }

    console.log(
      'Processed token balances:',
      tokenBalances.map((t) => {
        return `${t.symbol}: ${t.formattedBalance}`;
      }),
    );

    return NextResponse.json({
      tokens: tokenBalances,
      total: tokenBalances.length,
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

interface ChainConfigWithRpc extends ChainConfig {
  chain: Chain;
  rpcUrl: string;
}

function getChainConfig(chainId: number): ChainConfig | null {
  const configs: Record<number, ChainConfig> = {
    [haqqTestethiq.id]: {
      // HAQQ Devnet1
      apiUrl: haqqTestethiq.blockExplorers.default.apiUrl,
      nativeSymbol: 'ETH',
      nativeName: 'Ethereum',
    },
    [haqqEthiq.id]: {
      // HAQQ Ethiq
      apiUrl: haqqEthiq.blockExplorers.default.apiUrl,
      nativeSymbol: 'ETH',
      nativeName: 'Ethereum',
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
    [mainnet.id]: {
      // Mainnet
      apiUrl: 'https://eth.blockscout.com/api',
      nativeSymbol: 'ETH',
      nativeName: 'Ethereum',
    },
  };

  return configs[chainId] || null;
}

function getChainConfigWithRpc(chainId: number): ChainConfigWithRpc | null {
  const configs: Record<number, ChainConfigWithRpc> = {
    [haqqTestethiq.id]: {
      chain: haqqTestethiq,
      apiUrl: haqqTestethiq.blockExplorers.default.apiUrl,
      rpcUrl: haqqTestethiq.rpcUrls.default.http[0],
      nativeSymbol: 'ETH',
      nativeName: 'Ethereum',
    },
    [haqqEthiq.id]: {
      chain: haqqEthiq,
      apiUrl: haqqEthiq.blockExplorers.default.apiUrl,
      rpcUrl: haqqEthiq.rpcUrls.default.http[0],
      nativeSymbol: 'ETH',
      nativeName: 'Ethereum',
    },
    [sepolia.id]: {
      chain: sepolia,
      apiUrl: 'https://eth-sepolia.blockscout.com/api',
      rpcUrl: sepolia.rpcUrls.default.http[0],
      nativeSymbol: 'ETH',
      nativeName: 'Ethereum',
    },
    [haqqMainnet.id]: {
      chain: haqqMainnet,
      apiUrl: haqqMainnet.blockExplorers.default.apiUrl,
      rpcUrl: haqqMainnet.rpcUrls.default.http[0],
      nativeSymbol: 'ISLM',
      nativeName: 'Islamic Coin',
    },
    [haqqTestedge2.id]: {
      chain: haqqTestedge2,
      apiUrl: haqqTestedge2.blockExplorers.default.apiUrl,
      rpcUrl: haqqTestedge2.rpcUrls.default.http[0],
      nativeSymbol: 'ISLM',
      nativeName: 'Islamic Coin',
    },
    [mainnet.id]: {
      chain: mainnet,
      apiUrl: 'https://eth.blockscout.com/api',
      rpcUrl: mainnet.rpcUrls.default.http[0],
      nativeSymbol: 'ETH',
      nativeName: 'Ethereum',
    },
  };

  return configs[chainId] || null;
}
