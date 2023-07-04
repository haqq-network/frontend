import Head from 'next/head';
import { Fragment } from 'react';
import { WhitepaperMarkdownText } from '../whitepaper-markdown-text/whitepaper-markdown-text';
import { SideLink } from '../side-link/side-link';

import { CoinomicsModal } from '../coinomics-modal/coinomics-modal';
import { PageTitle } from '../hero-block/hero-block';

export function WhitepaperPage({ whitepaper }: { whitepaper: string }) {
  return (
    <Fragment>
      <Head>
        <title>HAQQ | Whitepaper</title>
      </Head>
      <PageTitle>HAQQ Whitepaper</PageTitle>
      <section className="flex bg-white">
        <div className="hidden items-end gap-y-[16px] border-r border-r-[#0d0d0e3d] pr-[34px] pt-[56px] md:flex md:w-1/3 md:flex-col xl:w-1/5">
          <SideLink isActive>Lorem ipsum dolor</SideLink>
          <SideLink>Islam</SideLink>
          <SideLink>Crypto</SideLink>
          <SideLink isActive>Blockchain</SideLink>
          <SideLink>Synthesis</SideLink>
          <SideLink isActive>Founders Reward</SideLink>
          <SideLink isActive>Private Sale and Partners Allocations</SideLink>
        </div>
        <WhitepaperMarkdownText className="w-full px-[16px] py-[60px] md:py-[80px] md:pl-[20px] md:pr-[64px] xl:pl-[150px] xl:pr-[200px]">
          {whitepaper}
        </WhitepaperMarkdownText>
      </section>
      <CoinomicsModal />
    </Fragment>
  );
}
