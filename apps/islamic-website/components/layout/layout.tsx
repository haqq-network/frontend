'use client';
import { Fragment, PropsWithChildren } from 'react';
import { Footer } from '../footer/footer';
import { MobileHeader } from '../header/header';
import { Alexandria, Handjet } from 'next/font/google';
import dynamic from 'next/dynamic';
import { VERCEL_ENV } from '../../constants';
import { CookieConsentModal } from '../cookie-consent-modal/cookie-consetnt-modal';
import Link from 'next/link';
import { Container } from '@haqq/islamic-website-ui-kit';
import Script from 'next/script';
import { SOCIAL_LINKS } from '../../social-links';
import { NextIntlClientProvider } from 'next-intl';
import clsx from 'clsx';

const alexandriaFont = Alexandria({
  subsets: ['latin', 'arabic'],
  display: 'swap',
  variable: '--font-alexandria',
  weight: ['300', '400', '600', '700', '800'],
});

const handjetFont = Handjet({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-handjet',
  weight: ['600'],
});

const DynamicHeader = dynamic(
  async () => {
    return await import('../header/header');
  },
  {
    ssr: true,
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
  const isScamBannerShow = true;

  return (
    <html
      lang={locale}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      className={clsx(alexandriaFont.variable, handjetFont.variable)}
    >
      {VERCEL_ENV !== 'development' && <CookieConsentModal />}
      <body className="bg-islamic-bg-black flex min-h-screen flex-col font-serif text-white antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {isScamBannerShow && <ScamBanner />}
          {isMobileUserAgent ? (
            <MobileHeader isBannerVisible={isScamBannerShow} />
          ) : (
            <DynamicHeader isBannerVisible={isScamBannerShow} />
          )}
          <div className="flex-1">{children}</div>
          <Footer socialLinks={SOCIAL_LINKS} />
        </NextIntlClientProvider>
      </body>
      {VERCEL_ENV === 'development' && (
        <Fragment>
          <script
            id="fb-pixel"
            data-cookiecategory="analytics"
            dangerouslySetInnerHTML={{
              __html: `
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '873030480371387');
                  fbq('track', 'PageView');
                `,
            }}
          />
          <Script
            id="gtm"
            data-cookiecategory="analytics"
            dangerouslySetInnerHTML={{
              __html: `
                  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','GTM-5H2ZFCN');
                `,
            }}
          />
        </Fragment>
      )}
    </html>
  );
}

function ScamBanner() {
  return (
    <div className="font-vcr fixed top-[0px] z-[9000] w-full bg-[#EB9226] py-[8px] text-center text-[16px] uppercase leading-[24px] text-white">
      <Container>
        Beware of scamers! <br className="block md:hidden" />
        Check{' '}
        <Link href="/scam-alert" className="underline">
          this page
        </Link>{' '}
        for more information
      </Container>
    </div>
  );
}
