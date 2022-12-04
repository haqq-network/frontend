import { Html, Main, Head, NextScript } from 'next/document';
import clsx from 'clsx';
import { ClashDisplayFont, HKGuiseFont } from '../lib/fonts';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <base href="/" />
        <link rel="icon" type="image/png" href="/favicon.png" sizes="32x32" />
      </Head>
      <body className={clsx(ClashDisplayFont.variable, HKGuiseFont.variable)}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
