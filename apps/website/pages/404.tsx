import { Fragment, ReactElement } from 'react';
import { Button } from '@haqq/website-ui-kit';
import Link from 'next/link';
import clsx from 'clsx';
import notFoundGlowImageData from '../assets/images/not-found-glow.png';
import Image from 'next/image';
import Head from 'next/head';
import { Header } from '../components/header/header';

export default function NotFoundPage() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center py-20">
      <Image
        alt=""
        src={notFoundGlowImageData.src}
        fill
        className="z-[-1] bg-center object-cover"
      />

      <div className="text-haqq-black font-serif text-[140px] leading-none sm:text-[180px] lg:text-[200px]">
        404
      </div>
      <div className="text-haqq-black max-w-[380px] text-center font-serif text-[24px] font-[500] sm:text-[32px] lg:max-w-none lg:text-[40px]">
        Sorry, this page doesn’t seem to exist
      </div>
      <div className="pt-[40px] sm:pt-[48px] lg:pt-[64px]">
        <Link href="/" className="leading-[0]">
          <Button variant={3}>Go to main page</Button>
        </Link>
      </div>
    </div>
  );
}

NotFoundPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Fragment>
      <Head>
        <meta
          name="viewport"
          content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no, width=device-width"
        />
      </Head>

      <main className={clsx('flex min-h-screen flex-col font-sans')}>
        <Header />
        {page}
      </main>
    </Fragment>
  );
};
