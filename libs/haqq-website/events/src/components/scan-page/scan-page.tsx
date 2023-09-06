import { Fragment } from 'react';
import Head from 'next/head';
import { ScanBlock } from '../scan-block/scan-block';

export function ScanPage() {
  return (
    <Fragment>
      <Head>
        <title>HAQQ | Event Scanner</title>
      </Head>

      <ScanBlock />
    </Fragment>
  );
}
