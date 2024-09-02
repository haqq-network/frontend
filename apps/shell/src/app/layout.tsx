import { PropsWithChildren } from 'react';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { SpeedInsights } from '@vercel/speed-insights/next';
import clsx from 'clsx';
import { Metadata, Viewport } from 'next';
import dynamic from 'next/dynamic';
import { headers } from 'next/headers';
import { cookieToInitialState } from 'wagmi';
import {
  ethToHaqq,
  indexerBalancesFetcher,
  parseWagmiCookies,
} from '@haqq/shell-shared';
import { Footer } from '@haqq/shell-ui-kit/server';
import { AppHeader } from '../components/header';
import { createWagmiConfig, supportedChainsIds } from '../config/wagmi-config';
import { env } from '../env/client';
import { clashDisplayFont, hkGuiseFont } from '../lib/fonts';
import { AppProviders } from '../providers/app-providers';
import { PHProvider } from '../providers/posthog-provider';
import './global.css';

export const metadata: Metadata = {
  title: {
    default: 'Shell | HAQQ',
    template: '%s | Shell | HAQQ',
  },
  referrer: 'origin-when-cross-origin',
  metadataBase: new URL('https://shell.haqq.network'),
};

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  width: 'device-width',
};

const PostHogPageView = dynamic(
  async () => {
    const { PostHogPageView } = await import('../components/posthog-page-view');
    return { default: PostHogPageView };
  },
  {
    ssr: false,
  },
);

const PostHogIdentifyWalletUsers = dynamic(
  async () => {
    const { PostHogIdentifyWalletUsers } = await import(
      '../components/posthog-identify-users'
    );
    return { default: PostHogIdentifyWalletUsers };
  },
  {
    ssr: false,
  },
);

const ParalaxBackground = dynamic(async () => {
  const { ParalaxBackground } = await import(
    '../components/paralax-background'
  );
  return { default: ParalaxBackground };
});

export default async function RootLayout({ children }: PropsWithChildren) {
  const wagmiConfig = createWagmiConfig();
  const headersList = headers();
  const userAgent = headersList.get('user-agent');
  const cookies = headersList.get('cookie');
  const { chainId, walletAddress } = parseWagmiCookies(cookies);
  const chainIdToUse =
    chainId && supportedChainsIds.includes(chainId)
      ? chainId
      : supportedChainsIds[0];

  const queryClient = new QueryClient();
  const initialState = cookieToInitialState(wagmiConfig, cookies);

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
      dir="ltr"
      className={clsx(clashDisplayFont.variable, hkGuiseFont.variable)}
    >
      <PHProvider>
        <body className="relative flex min-h-screen flex-col">
          <AppProviders
            initialState={initialState}
            dehydratedState={dehydratedState}
            walletConnectProjectId={env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID}
            userAgent={userAgent}
          >
            <PostHogPageView />
            <PostHogIdentifyWalletUsers />
            <SpeedInsights />

            <AppHeader />

            <main className="relative flex-1 overflow-x-clip">{children}</main>

            <Footer commitSha={env.NEXT_PUBLIC_GIT_COMMIT_SHA} />
          </AppProviders>

          <ParalaxBackground />
        </body>
      </PHProvider>
    </html>
  );
}
