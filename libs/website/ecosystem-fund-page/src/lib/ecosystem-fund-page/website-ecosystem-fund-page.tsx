import { Fragment } from 'react';
import { ApplyBlock } from '../apply-block/apply-block';
import { TextBlock } from '../text-block.tsx/text-block';
import { TitleBlock } from '../title-block/title-block';
import Head from 'next/head';

export function EcosystemFundPage() {
  return (
    <Fragment>
      <Head>
        <title>HAQQ | Ecosystem fund</title>
      </Head>
      <TitleBlock />
      <TextBlock />
      <ApplyBlock />
    </Fragment>
  );
}
