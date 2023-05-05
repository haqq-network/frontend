import { Html, Main, Head, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en" className="ltr scroll-smooth">
      <Head>
        <meta charSet="utf-8" />
        <base href="/" />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
