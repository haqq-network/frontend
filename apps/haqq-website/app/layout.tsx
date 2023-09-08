import '../styles/global.css';
import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { DEPLOY_URL } from '../constants';

export const metadata: Metadata = {
  title: {
    template: '%s | HAQQ',
    default: 'HAQQ',
  },
  referrer: 'origin-when-cross-origin',
  viewport: {
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    width: 'device-width',
  },
  metadataBase: new URL(DEPLOY_URL),
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className="ltr">
      <body className="will-change-scroll">{children}</body>
    </html>
  );
}
