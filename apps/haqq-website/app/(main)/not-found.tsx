import { Button } from '@haqq/haqq-website-ui-kit';
import Image from 'next/image';
import Link from 'next/link';
import notFoundGlowImageData from '../../assets/images/not-found-glow.png';

export default function NotFoundPage() {
  return (
    <div className="min relative flex flex-1 flex-col items-center justify-center py-20 md:py-40">
      <Image
        alt=""
        src={notFoundGlowImageData}
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
