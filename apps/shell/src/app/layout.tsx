import { PropsWithChildren } from 'react';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { SpeedInsights } from '@vercel/speed-insights/next';
import clsx from 'clsx';
import { Metadata, Viewport } from 'next';
import dynamic from 'next/dynamic';
import { headers } from 'next/headers';
import { cookieToInitialState } from 'wagmi';
import { haqqMainnet } from 'wagmi/chains';
import {
  ethToHaqq,
  indexerBalancesFetcher,
  parseWagmiCookies,
} from '@haqq/shell-shared';
import { Footer } from '@haqq/shell-ui-kit/server';
import { AppHeader } from '../components/header';
import { AppHeaderMobile } from '../components/header-mobile';
import { createWagmiConfig } from '../config/wagmi-config';
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

const PosthogIdentifyWalletUsers = dynamic(
  async () => {
    const { PosthogIdentifyWalletUsers } = await import(
      '../components/posthog-identify-users'
    );
    return { default: PosthogIdentifyWalletUsers };
  },
  {
    ssr: false,
  },
);

const ParalaxBackground = dynamic(
  async () => {
    const { ParalaxBackground } = await import(
      '../components/paralax-background'
    );
    return { default: ParalaxBackground };
  },
  // {
  //   ssr: false,
  // },
);

export default async function RootLayout({ children }: PropsWithChildren) {
  const wagmiConfig = createWagmiConfig();
  const headersList = headers();
  const cookies = headersList.get('cookie');
  const { chainId: parsedChainId, walletAddress } = parseWagmiCookies(cookies);
  const chainId = parsedChainId ?? haqqMainnet.id;
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
        return await indexerBalancesFetcher(chainId, haqqAddress);
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
          <ParalaxBackground />

          <AppProviders
            initialState={initialState}
            dehydratedState={dehydratedState}
          >
            <PostHogPageView />
            <PosthogIdentifyWalletUsers />
            <SpeedInsights />

            <>
              {isMobileUA ? <AppHeaderMobile /> : <AppHeader />}

              <main className="relative flex-1 overflow-x-clip">
                {children}
              </main>

              <Footer />
            </>
          </AppProviders>
        </body>
      </PHProvider>
    </html>
  );
}
