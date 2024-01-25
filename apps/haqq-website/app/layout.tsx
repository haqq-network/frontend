import '../styles/global.css';
import type { Metadata, Viewport } from 'next';
import type { PropsWithChildren } from 'react';
import { DEPLOY_URL, VERCEL_ENV } from '../constants';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: {
    template: '%s | HAQQ',
    default: 'HAQQ',
  },
  referrer: 'origin-when-cross-origin',
  metadataBase: new URL(DEPLOY_URL),
};

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  width: 'device-width',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className="ltr">
      <body className="will-change-scroll">
        {children}
        {VERCEL_ENV === 'production' && (
          <>
            <Analytics mode="auto" />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  );
}
