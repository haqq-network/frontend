import { Fragment, ReactElement } from 'react';
import { Button } from '@haqq/website/ui-kit';
import Link from 'next/link';
import clsx from 'clsx';
import notFoundGlowImageData from '../assets/images/not-found-glow.png';
import Image from 'next/image';
import Head from 'next/head';
import { Header } from '../components/header/header';
import { ClashDisplayFont, HKGuiseFont } from '@haqq/website/shared';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center relative flex-1 py-20">
      <Image
        alt=""
        src={notFoundGlowImageData.src}
        fill
        className="z-[-1] object-cover bg-center"
      />

      <div className="text-[140px] sm:text-[180px] lg:text-[200px] leading-none font-serif text-haqq-black">
        404
      </div>
      <div className="font-[500] text-[24px] sm:text-[32px] lg:text-[40px] font-serif text-haqq-black max-w-[380px] lg:max-w-none text-center">
        Sorry, this page doesn’t seem to exist
      </div>
      <div className="pt-[40px] sm:pt-[48px] lg:pt-[64px]">
        <Link href="/">
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main
        className={clsx(
          ClashDisplayFont.variable,
          HKGuiseFont.variable,
          'min-h-screen flex flex-col',
        )}
      >
        <Header />
        {page}
      </main>
    </Fragment>
  );
};
