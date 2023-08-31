import { Fragment } from 'react';
import { TitleBlock } from '../title-block/title-block';
import { ApplyBlock } from '../apply-block/apply-block';
import { Partner, PartnersBlock } from '../partners-block/partners-block';
import { DEPLOY_URL } from '@haqq/haqq-website/blog-page';
import Head from 'next/head';

export function EcosystemPage({ partners }: { partners: Partner[] }) {
  return (
    <Fragment>
      <Head>
        <title>HAQQ | Ecosystem</title>

        <meta name="description" content="" />
        <meta property="og:locale" content="en-US" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="HAQQ | Ecosystem" />
        <meta property="og:description" content="" />
        <meta
          property="og:url"
          content={`${new URL('/ecosystem', DEPLOY_URL).toString()}`}
        />
        <meta
          property="og:image"
          content={`${new URL(DEPLOY_URL)}opengraph-image.png`}
        />
        <meta name="twitter:title" content="HAQQ | Ecosystem" />
        <meta name="twitter:description" content="" />
        <meta
          name="twitter:image"
          content={`${new URL(DEPLOY_URL)}opengraph-image.png`}
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <TitleBlock />
      <ApplyBlock />
      <PartnersBlock partners={partners} />
    </Fragment>
  );
}
