'use client';
import { PropsWithChildren, useEffect } from 'react';
import { Footer } from '../../components/footer/footer';
import { MobileHeader } from '../../components/header/header';
import { Alexandria, Handjet } from 'next/font/google';
import dynamic from 'next/dynamic';
import { NextIntlClientProvider } from 'next-intl';
import { SOCIAL_LINKS } from '../../constants';

import 'swiper/css';
import 'swiper/css/navigation';
import '../../styles/global.css';
import clsx from 'clsx';

const alexandria = Alexandria({
  subsets: ['latin', 'arabic'],
  display: 'swap',
  variable: '--font-alexandria',
  weight: ['300', '400', '600', '700', '800'],
});

const handjet = Handjet({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-handjet',
  weight: ['600'],
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

export function ClientLayout({
  children,
  locale,
  messages,
  isMobileUserAgent,
}: PropsWithChildren<{
  locale: string;
  messages: Record<string, string>;
  isMobileUserAgent: boolean;
}>) {
  const shortLocale = locale ? locale : 'en';

  useEffect(() => {
    const dir = shortLocale == 'ar' ? 'rtl' : 'ltr';

    document?.querySelector('html')?.setAttribute('dir', dir);
  }, [shortLocale]);

  return (
    <html lang={locale} className={clsx(alexandria.variable, handjet.variable)}>
      <body className="bg-islamic-bg-black relative flex min-h-screen flex-col font-serif text-white antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {isMobileUserAgent ? <MobileHeader /> : <DynamicHeader />}
          <div className="flex-1">{children}</div>
          <Footer socialLinks={SOCIAL_LINKS} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
