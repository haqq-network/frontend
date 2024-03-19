import type { PropsWithChildren } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import clsx from 'clsx';
import type { Metadata, Viewport } from 'next';
import type { Config } from '@haqq/shell-shared';
import { AppWrapper } from '../components/app-wrapper';
import { Providers } from '../components/providers';
import { clashDisplayFont, hkGuiseFont } from '../lib/fonts';
import './global.css';

export const metadata: Metadata = {
  title: {
    default: 'Shell | HAQQ',
    template: '%s | Shell | HAQQ',
  },
  referrer: 'origin-when-cross-origin',
  metadataBase: new URL('https://shell.haqq.hetwork'),
};

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  width: 'device-width',
};

const shellConfig: Config = {
  commitSha: process.env.NEXT_PUBLIC_COMMIT_SHA ?? 'dev',
  faucetConfig: {
    serviceEndpoint: process.env.FAUCET_SERVICE_ENDPOINT,
    auth0Domain: process.env.FAUCET_AUTH0_DOMAIN,
    auth0ClientId: process.env.FAUCET_AUTH0_CLIENT_ID,
  },
  reCaptchaConfig: {
    siteKey: process.env.FAUCET_RECAPTCHA_SITE_KEY,
  },
  walletConnectConfig: {
    projectId: process.env.WALLET_CONNECT_PROJECT_ID,
  },
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={clsx('ltr', clashDisplayFont.variable, hkGuiseFont.variable)}
    >
      <body>
        <Providers config={shellConfig}>
          <AppWrapper>{children}</AppWrapper>
        </Providers>

        {process.env['VERCEL_ENV'] === 'production' && (
          <>
            <Analytics mode="auto" />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  );
}
