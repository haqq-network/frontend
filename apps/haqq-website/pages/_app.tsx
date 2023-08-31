import { Fragment, ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import '../styles/global.css';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import { Header } from '../components/header/header';
import { Footer } from '../components/footer/footer';

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
    <Fragment>
      <Head>
        <meta
          name="viewport"
          content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no, width=device-width"
        />
        <link rel="icon" type="image/png" href="/favicon.png" sizes="32x32" />
      </Head>

      <main className="relative flex min-h-screen flex-col overflow-x-clip font-sans">
        <Header />

        <div className="flex-1">
          <Component {...pageProps} />
        </div>

        <Footer />
      </main>

      <Toaster />
    </Fragment>
  );
}
