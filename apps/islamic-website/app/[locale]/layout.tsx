import type { Metadata, Viewport } from 'next';
import { PropsWithChildren } from 'react';
import { DEPLOY_URL, VERCEL_ENV } from '../../constants';
import clsx from 'clsx';
import { CookieConsentModal } from '../../components/cookie-consent-modal/cookie-consent-modal';
import { NextIntlClientProvider } from 'next-intl';
import { Container } from '@haqq/islamic-website-ui-kit';
import Script from 'next/script';
import Header from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { SOCIAL_LINKS } from '../../social-links';
import { alexandriaFont, handjetFont, vcrFont } from '../../fonts';
import { Analytics } from '@vercel/analytics/react';
import { LocaleType } from '@haqq/islamic-website/shariah-page';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { notFound } from 'next/navigation';
import 'swiper/css';
import 'swiper/css/navigation';
import '../../styles/global.css';
import '../../styles/consent-cookie.css';

const { Link } = createSharedPathnamesNavigation({
  locales: ['en', 'ar', 'id'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | IslamicCoin',
    default: 'IslamicCoin',
  },
  referrer: 'origin-when-cross-origin',
  metadataBase: new URL(DEPLOY_URL),
  other: {
    google: 'notranslate',
  },
};

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 2,
  width: 'device-width',
};

async function getMessages(locale: string) {
  const { default: defaultMessages } = await import(
    `../../messages/${locale}.json`
  );
  return defaultMessages;
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: PropsWithChildren<{ params: { locale: LocaleType } }>) {
  const messages = await getMessages(locale);

  if (!messages) {
    notFound();
  }

  const isScamBannerShow = true;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'GMT';

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone={timeZone}
    >
      <html
        lang={locale}
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
        translate="no"
        className={clsx(
          alexandriaFont.variable,
          handjetFont.variable,
          vcrFont.variable,
        )}
      >
        <body className="bg-islamic-bg-black font-alexandria flex min-h-screen flex-col text-white antialiased">
          {isScamBannerShow && <ScamBanner />}

          <Header locale={locale} isBannerVisible={isScamBannerShow} />

          <main className="flex-1">{children}</main>
          <Footer socialLinks={SOCIAL_LINKS} />

          {VERCEL_ENV === 'production' && (
            <div>
              <Script
                async={true}
                defer={true}
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
                async={true}
                defer={true}
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
              <CookieConsentModal />
              <Analytics mode="auto" />
            </div>
          )}
        </body>
      </html>
    </NextIntlClientProvider>
  );
}

function ScamBanner() {
  return (
    <div className="ltr:font-vcr rtl:font-handjet fixed top-[0px] z-[9000] w-full bg-[#EB9226] py-[8px] text-center text-[16px] uppercase leading-[24px] text-white">
      <Container>
        Beware of scammers! <br className="block md:hidden" />
        Check{' '}
        <Link href="/scam-alert" className="underline">
          this page
        </Link>{' '}
        for more information
      </Container>
    </div>
  );
}
