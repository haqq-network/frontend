import { PageTitle } from '@haqq/website-ui-kit';
import Head from 'next/head';
import { Fragment } from 'react';
import { WhitepaperMarkdownText } from '../whitepaper-markdown-text/whitepaper-markdown-text';

export function WhitepaperPage({ whitepaper }: { whitepaper: string }) {
  return (
    <Fragment>
      <Head>
        <title>HAQQ | Whitepaper</title>
      </Head>
      <PageTitle>HAQQ Whitepaper</PageTitle>
      <section className="flex bg-white">
        <div className="hidden border-r border-r-[#0d0d0e3d] md:block md:w-1/3 xl:w-1/5">
          asd
        </div>
        <WhitepaperMarkdownText className="w-full px-[16px] py-[60px]">
          {whitepaper}
        </WhitepaperMarkdownText>
      </section>
    </Fragment>
  );
}
