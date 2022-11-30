import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import clsx from 'clsx';
import { ClashDisplayFont, HKGuiseFont } from '../lib/fonts';
import { Footer, Header } from '@haqq/website/ui-kit';
import '../styles/global.css';

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  if (Component.getLayout) {
    return Component.getLayout(<Component {...pageProps} />);
  }

  return (
    <div
      className={clsx(
        ClashDisplayFont.variable,
        HKGuiseFont.variable,
        'min-h-screen flex flex-col',
      )}
    >
      <Header />
      <main className="flex-1">
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}
