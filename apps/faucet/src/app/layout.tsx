import { PropsWithChildren } from 'react';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import { cookieToInitialState } from 'wagmi';
import {
  ethToHaqq,
  indexerBalancesFetcher,
  parseWagmiCookies,
} from '@haqq/shell-shared';
import { createWagmiConfig, supportedChainsIds } from '../config/wagmi-config';
import { env } from '../env/client';
import { clashDisplayFont, hkGuiseFont } from '../lib/fonts';
import { AppProviders } from '../providers/app-providers';
import './global.css';

export const metadata: Metadata = {
  title: 'Faucet | HAQQ',
  description: 'Get testnet tokens for HAQQ TestEdge network',
  referrer: 'origin-when-cross-origin',
};

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  width: 'device-width',
};

export default async function RootLayout({ children }: PropsWithChildren) {
  const wagmiConfig = createWagmiConfig();
  const headersList = headers();
  const cookies = headersList.get('cookie');
  const { chainId, walletAddress } = parseWagmiCookies(cookies);
  const chainIdToUse =
    chainId && supportedChainsIds.includes(chainId)
      ? chainId
      : supportedChainsIds[0];

  const queryClient = new QueryClient();
  const initialState = cookieToInitialState(wagmiConfig, cookies);
  const userAgent = headersList.get('user-agent');
  const isMobileUA = Boolean(
    userAgent?.match(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i,
    ),
  );

  if (walletAddress) {
    const haqqAddress = ethToHaqq(walletAddress);

    await queryClient.prefetchQuery({
      queryKey: [chainId, 'indexer-balance', haqqAddress],
      queryFn: async () => {
        return await indexerBalancesFetcher(chainIdToUse, haqqAddress);
      },
    });
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <html
      lang="en"
      className={clsx(clashDisplayFont.variable, hkGuiseFont.variable)}
    >
      <body className="relative flex min-h-screen flex-col bg-[#0D1F2D]">
        <AppProviders
          initialState={initialState}
          dehydratedState={dehydratedState}
          walletConnectProjectId={env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID}
          isMobileUA={isMobileUA}
        >
          <main className="relative flex-1">{children}</main>
        </AppProviders>
      </body>
    </html>
  );
}
