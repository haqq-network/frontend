import Head from 'next/head';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { WhitepaperMarkdownText } from '../whitepaper-markdown-text/whitepaper-markdown-text';
import { SideLink } from '../side-link/side-link';
import { CoinomicsModal } from '../coinomics-modal/coinomics-modal';
import { PageTitle } from '../hero-block/hero-block';
import { useRouter } from 'next/router';

export function WhitepaperPage({ whitepaper }: { whitepaper: string }) {
  const router = useRouter();
  const { query } = router;
  const [isOpen, setIsOpen] = useState(false);

  // function findH2Elements(markdownString: string): string[] {
  //   const h2Regex = /## (.+?)(?:\n\n|$)/g;
  //   const matches = markdownString.match(h2Regex) || [];
  //   const h2Elements = matches.map((match) => {
  //     return match.replace('## ', '').replace(/\n\n$/, '');
  //   });
  //   return h2Elements;
  // }

  // const h2Elements = useMemo(() => {
  //   return findH2Elements(whitepaper);
  // }, [whitepaper]);

  useEffect(() => {
    setIsOpen(query.centuryCoinomics === 'true');
  }, [query.centuryCoinomics]);

  const closeCoinomicsModal = useCallback(() => {
    router.push({ query: {} }, undefined, { scroll: false });
    setIsOpen(false);
  }, [router]);

  return (
    <Fragment>
      <Head>
        <title>HAQQ | Whitepaper</title>
      </Head>
      <PageTitle>HAQQ Whitepaper</PageTitle>
      <section className="flex bg-white">
        <WhitepaperMarkdownText className="w-full px-[16px] py-[60px] md:py-[80px] md:pl-[20px] md:pr-[64px] xl:pl-[150px] xl:pr-[200px]">
          {whitepaper}
        </WhitepaperMarkdownText>
      </section>
      <CoinomicsModal isOpen={isOpen} onClose={closeCoinomicsModal} />
    </Fragment>
  );
}
