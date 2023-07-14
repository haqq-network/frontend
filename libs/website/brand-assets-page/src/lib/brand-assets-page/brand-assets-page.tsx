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
      </Head>
      <TitleBlock />
      <HaqqAssetsBlock />
      <IslamicAssetsBlock />
    </Fragment>
  );
}
