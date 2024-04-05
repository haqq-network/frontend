import type { PropsWithChildren } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import clsx from 'clsx';
import type { Metadata, Viewport } from 'next';
import dynamic from 'next/dynamic';
import type { Config } from '@haqq/shell-shared';
import { AppWrapper } from '../components/app-wrapper';
import { PHProvider } from '../components/posthog';
import { Providers } from '../components/providers';
import { clashDisplayFont, hkGuiseFont } from '../lib/fonts';
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

const shellConfig: Config = {
  commitSha: process.env.GIT_COMMIT_SHA ?? 'dev',
  faucetConfig: {
    serviceEndpoint: process.env.FAUCET_SERVICE_ENDPOINT,
    auth0Domain: process.env.FAUCET_AUTH0_DOMAIN,
    auth0ClientId: process.env.FAUCET_AUTH0_CLIENT_ID,
  },
  reCaptchaConfig: {
    siteKey: process.env.FAUCET_RECAPTCHA_SITE_KEY,
  },
  walletConnectConfig: {
    projectId: process.env.WALLETCONNECT_PROJECT_ID,
  },
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

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={clsx('ltr', clashDisplayFont.variable, hkGuiseFont.variable)}
    >
      <PHProvider>
        <body>
          <PostHogPageView />
          <Analytics mode="auto" />
          <SpeedInsights />

          <Providers config={shellConfig}>
            <AppWrapper>{children}</AppWrapper>
          </Providers>
        </body>
      </PHProvider>
    </html>
  );
}
