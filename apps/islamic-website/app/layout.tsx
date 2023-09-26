import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';
import { headers } from 'next/headers';
import { Footer } from '../components/footer/footer';
import { MobileHeader } from '../components/header/header';
import { Alexandria } from 'next/font/google';
import dynamic from 'next/dynamic';
import clsx from 'clsx';
import { DEPLOY_URL } from '../constants';

import 'swiper/css';
import 'swiper/css/navigation';
import '../styles/global.css';
import Link from 'next/link';
import { Container } from '@haqq/islamic-website-ui-kit';

export const metadata: Metadata = {
  title: {
    template: '%s | IslamicCoin',
    default: 'IslamicCoin',
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

const alexandriaFont = Alexandria({
  subsets: ['latin', 'arabic'],
  display: 'swap',
  variable: '--font-alexandria',
  weight: ['300', '400', '600', '700', '800'],
});

const DynamicHeader = dynamic(
  async () => {
    return await import('../components/header/header');
  },
  {
    ssr: true,
    loading: () => {
      return <div className="h-[72px] lg:h-[92px]" />;
    },
  },
);

export default function RootLayout({ children }: PropsWithChildren) {
  const headersList = headers();
  const userAgent = headersList.get('user-agent');
  const isMobileUserAgent = Boolean(
    userAgent!.match(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i,
    ),
  );
  const isScamBannerShow = true;

  return (
    <html lang="en" className={clsx('ltr', alexandriaFont.variable)}>
      <body className="bg-islamic-bg-black font-alexandria flex min-h-screen flex-col text-white antialiased">
        {isScamBannerShow && <ScamBanner />}
        {isMobileUserAgent ? (
          <MobileHeader isBannerVisible={isScamBannerShow} />
        ) : (
          <DynamicHeader isBannerVisible={isScamBannerShow} />
        )}
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}

function ScamBanner() {
  return (
    <div className="font-vcr fixed top-[0px] z-[9000] w-full bg-[#EB9226] py-[8px] text-center text-[16px] uppercase leading-[24px] text-white">
      <Container>
        Beware of scamers! Check{' '}
        <Link href="/scam-alert" className="underline">
          this page
        </Link>{' '}
        for more information
      </Container>
    </div>
  );
}
