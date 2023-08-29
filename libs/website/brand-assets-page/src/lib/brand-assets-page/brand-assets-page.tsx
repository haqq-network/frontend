import { Fragment } from 'react';
import {
  HaqqAssetsBlock,
  IslamicAssetsBlock,
} from '../assets-block/assets-block';
import { TitleBlock } from '../title-block/title-block';
import Head from 'next/head';

export function BrandAssetsPage() {
  return (
    <Fragment>
      <Head>
        <title>HAQQ | Brand assets</title>
        <meta
          property="og:image"
          content={'/assets/images/opengraph-image.png'}
        />
      </Head>
      <TitleBlock />
      <HaqqAssetsBlock />
      <IslamicAssetsBlock />
    </Fragment>
  );
}
