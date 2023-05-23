import { Fragment } from 'react';
import Head from 'next/head';
import { TitleBlock } from '../title-block/title-block';
import { ApplyBlock } from '../apply-block/apply-block';
import { PartnersBlock } from '../partners-block/partners-block';

export function EcosystemPage({ story }) {
  const partners = story?.content?.body?.[0]?.columns ?? [];

  return (
    <Fragment>
      <Head>
        <title>HAQQ | Ecosystem</title>
      </Head>
      <TitleBlock />
      <ApplyBlock />
      <PartnersBlock partners={partners} />
    </Fragment>
  );
}
