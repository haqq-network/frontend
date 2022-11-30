import type { ReactElement } from 'react';
import { Button, Header } from '@haqq/website/ui-kit';
import Link from 'next/link';
import { ClashDisplayFont, HKGuiseFont } from '../lib/fonts';
import clsx from 'clsx';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center relative flex-1 bg-404-page py-20">
      <div className="text-[140px] md:text-[180px] lg:text-[200px] leading-none font-serif text-haqq-black">
        404
      </div>
      <div className="font-[500] text-[24px] md:text-[32px] lg:text-[40px] font-serif text-haqq-black max-w-[380px] lg:max-w-none text-center">
        Sorry, this page doesn’t seem to exist
      </div>
      <div className="pt-[40px] md:pt-[48px] lg:pt-[64px]">
        <Link href="/">
          <Button variant={3}>Go to main page</Button>
        </Link>
      </div>
    </div>
  );
}

NotFoundPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <div
      className={clsx(
        ClashDisplayFont.variable,
        HKGuiseFont.variable,
        'min-h-screen flex flex-col',
      )}
    >
      <Header />
      {page}
    </div>
  );
};
