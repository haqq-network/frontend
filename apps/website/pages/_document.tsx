import { Html, Main, Head, NextScript } from 'next/document';
import { Fragment } from 'react';

const GOOGLE_TAG_ID = process.env['GOOGLE_TAG_ID'];

export default function Document() {
  return (
    <Html lang="en" className="ltr">
      <Head>
        <meta charSet="utf-8" />
        <base href="/" />

        {GOOGLE_TAG_ID && GOOGLE_TAG_ID !== '' && (
          <Fragment>
            {/* Start Google Analytics */}
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GOOGLE_TAG_ID}');
                `,
              }}
            />
            {/* End Google Analytics */}
          </Fragment>
        )}
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
