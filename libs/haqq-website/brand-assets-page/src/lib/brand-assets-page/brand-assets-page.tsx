import { Fragment } from 'react';
import {
  HaqqAssetsBlock,
  IslamicAssetsBlock,
} from '../assets-block/assets-block';
import { TitleBlock } from '../title-block/title-block';
import { DEPLOY_URL } from '@haqq/website/blog-page';
import Head from 'next/head';

export function BrandAssetsPage() {
  return (
    <Fragment>
      <Head>
        <title>HAQQ | Brand assets</title>

        <meta name="description" content="" />
        <meta property="og:locale" content="en-US" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="HAQQ | Brand assets" />
        <meta property="og:description" content="" />
        <meta
          property="og:url"
          content={`${new URL('/brand-assets', DEPLOY_URL).toString()}`}
        />
        <meta
          property="og:image"
          content={`${new URL(DEPLOY_URL)}opengraph-image.png`}
        />
        <meta name="twitter:title" content="HAQQ | Brand assets" />
        <meta name="twitter:description" content="" />
        <meta
          name="twitter:image"
          content={`${new URL(DEPLOY_URL)}opengraph-image.png`}
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <TitleBlock />
      <HaqqAssetsBlock />
      <IslamicAssetsBlock />
    </Fragment>
  );
}
