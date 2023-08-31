import { Fragment } from 'react';
import { ApplyBlock } from '../apply-block/apply-block';
import { TextBlock } from '../text-block.tsx/text-block';
import { TitleBlock } from '../title-block/title-block';
import { DEPLOY_URL } from '@haqq/haqq-website/blog-page';
import Head from 'next/head';

export function EcosystemFundPage() {
  return (
    <Fragment>
      <Head>
        <title>HAQQ | Ecosystem fund</title>

        <meta name="description" content="" />
        <meta property="og:locale" content="en-US" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="HAQQ | Ecosystem fund" />
        <meta property="og:description" content="" />
        <meta
          property="og:url"
          content={`${new URL('/ecosystem-fund', DEPLOY_URL).toString()}`}
        />
        <meta
          property="og:image"
          content={`${new URL(DEPLOY_URL)}opengraph-image.png`}
        />
        <meta name="twitter:title" content="HAQQ | Ecosystem fund" />
        <meta name="twitter:description" content="" />
        <meta
          name="twitter:image"
          content={`${new URL(DEPLOY_URL)}opengraph-image.png`}
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <TitleBlock />
      <TextBlock />
      <ApplyBlock />
    </Fragment>
  );
}
