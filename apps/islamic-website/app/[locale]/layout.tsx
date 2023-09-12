import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';
import { headers } from 'next/headers';
import { Footer } from '../../components/footer/footer';
import { MobileHeader } from '../../components/header/header';
import { Alexandria } from 'next/font/google';
import dynamic from 'next/dynamic';
import clsx from 'clsx';
import { DEPLOY_URL } from '../../constants';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';

import 'swiper/css';
import 'swiper/css/navigation';
import '../../styles/global.css';

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

const alexandria = Alexandria({
  subsets: ['latin', 'arabic'],
  display: 'swap',
  variable: '--font-alexandria',
  weight: ['300', '400', '600', '700', '800'],
});

const DynamicHeader = dynamic(
  async () => {
    return await import('../../components/header/header');
  },
  {
    ssr: false,
    loading: () => {
      return <div className="h-[72px] lg:h-[92px]" />;
    },
  },
);

async function getMessages(locale: string) {
  try {
    return (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
}

export async function generateStaticParams() {
  return ['en', 'ar'].map((locale) => {
    return { locale };
  });
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: PropsWithChildren<{ params: { locale: string } }>) {
  const headersList = headers();
  const userAgent = headersList.get('user-agent');
  const isMobileUserAgent = Boolean(
    userAgent!.match(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i,
    ),
  );

  // const locale = useLocale();
  const messages = await getMessages(locale);

  // Validate that the incoming `locale` parameter is a valid locale
  // if (params.locale !== locale) {
  //   notFound();
  // }

  return (
    <html lang={locale} className={clsx('ltr', alexandria.variable)}>
      <body className="bg-islamic-bg-black relative flex min-h-screen flex-col font-serif text-white antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {isMobileUserAgent ? <MobileHeader /> : <DynamicHeader />}
          <div className="flex-1">{children}</div>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
