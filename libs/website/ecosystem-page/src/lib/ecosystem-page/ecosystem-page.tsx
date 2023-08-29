import { Fragment } from 'react';
import Head from 'next/head';
import { TitleBlock } from '../title-block/title-block';
import { ApplyBlock } from '../apply-block/apply-block';
import { Partner, PartnersBlock } from '../partners-block/partners-block';

export function EcosystemPage({ partners }: { partners: Partner[] }) {
  return (
    <Fragment>
      <Head>
        <title>HAQQ | Ecosystem</title>
        <meta property="og:image" content={'/opengraph-image.png'} />
      </Head>
      <TitleBlock />
      <ApplyBlock />
      <PartnersBlock partners={partners} />
    </Fragment>
  );
}
