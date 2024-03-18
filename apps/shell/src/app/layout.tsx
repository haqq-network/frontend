import type { PropsWithChildren } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import clsx from 'clsx';
import type { Metadata, Viewport } from 'next';
import './global.css';
import { AppWrapper } from '../components/app-wrapper';
import { Providers } from '../components/providers';
import { clashDisplayFont, hkGuiseFont } from '../lib/fonts';

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

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={clsx('ltr', clashDisplayFont.variable, hkGuiseFont.variable)}
    >
      <body>
        <Providers>
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
