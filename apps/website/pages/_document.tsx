import { Html, Main, Head, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en" className="ltr">
      <Head>
        <meta charSet="utf-8" />
        <meta name="apple-itunes-app" content="app-id=6443843352" />
        <base href="/" />
        <link rel="icon" type="image/png" href="/favicon.png" sizes="32x32" />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
