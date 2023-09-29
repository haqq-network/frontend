import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';
import { DEPLOY_URL } from '../../constants';
import { notFound } from 'next/navigation';
import { ClientLayout } from '../../components/layout/layout';
import { headers } from 'next/headers';

import 'swiper/css';
import 'swiper/css/navigation';
import '../../styles/global.css';
import '../../styles/consent-cookie.css';

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

async function getMessages(locale: string) {
  try {
    return (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
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

  const messages = await getMessages(locale);

  return (
    <ClientLayout
      locale={locale}
      messages={messages}
      isMobileUserAgent={isMobileUserAgent}
    >
      {children}
    </ClientLayout>
  );
}
