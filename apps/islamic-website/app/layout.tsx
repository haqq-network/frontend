import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';
import { headers } from 'next/headers';
import { Footer } from '../components/footer/footer';
import { MobileHeader } from '../components/header/header';
import { Alexandria } from 'next/font/google';
import dynamic from 'next/dynamic';
import clsx from 'clsx';

import 'swiper/css';
import 'swiper/css/navigation';
import '../styles/global.css';

export const metadata: Metadata = {
  title: 'IslamicCoin',
  description:
    'Your gateway to a Shariah-compliant decentralized world. Islamic Coin stands at the vanguard of ethical digital finance.',
  viewport: {
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    width: 'device-width',
  },
};

const alexandria = Alexandria({
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
    ssr: false,
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

  return (
    <html lang="en" className={clsx('ltr', alexandria.variable)}>
      <body className="bg-islamic-bg-black relative flex min-h-screen flex-col font-serif text-white antialiased">
        {isMobileUserAgent ? <MobileHeader /> : <DynamicHeader />}
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
