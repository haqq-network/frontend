import { Fragment } from 'react';
import { HaqqBlock, IslamicBlock } from '../haqq-block/haqq-block';
import { TitleBlock } from '../title-block/title-block';
import Head from 'next/head';

export function BrandAssetsPage() {
  return (
    <Fragment>
      <Head>
        <title>HAQQ | Brand assets</title>
      </Head>
      <TitleBlock />
      <HaqqBlock />
      <IslamicBlock />
    </Fragment>
  );
}
