import { PropsWithChildren } from 'react';
import { unstable_setRequestLocale } from 'next-intl/server';
import { SUPPORTED_LOCALES } from '../constants';

export default function RootLayout({
  children,
  params: { locale },
}: PropsWithChildren & { params: { locale: string } }) {
  unstable_setRequestLocale(locale);

  return children;
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => {
    return { locale };
  });
}
