import { Button } from '@haqq/website/ui-kit';
import Image from 'next/image';
import Link from 'next/link';
import sunshineBgData from '../../assets/sunshine.svg';

export function TitleBlock() {
  return (
    <section className="relative pt-[80px] sm:pt-[120px] pl-[16px] sm:pl-[48px] lg:pl-[80px]">
      <div className="uppercase font-serif text-[46px] sm:text-[80px] lg:text-[140px] leading-none font-medium">
        Haqq <br /> Ecosys
        <br className="hidden lg:block xl:hidden" />
        tem <br className="block lg:hidden xl:block" /> Fund
      </div>
      <Link href={'#apply'} className="scroll-smooth" scroll={false}>
        <Button
          variant={2}
          className="mb-[80px] sm:mb-[120px] mt-[32px] sm:mt-[48px] lg:mt-[64px]"
        >
          Apply
        </Button>
      </Link>
      <Image
        src={sunshineBgData.src}
        alt=""
        height={sunshineBgData.height}
        width={sunshineBgData.width}
        className="absolute bottom-0 left-1/2 z-[-1] transform -translate-x-1/2"
      />
    </section>
  );
}
