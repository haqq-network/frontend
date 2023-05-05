import { Button } from '@haqq/website/ui-kit';
import Image from 'next/image';
import Link from 'next/link';
import sunshineBgData from '../../assets/sunshine.svg';
import titleBlockLinesBgData from '../../assets/title-block-lines.svg';
import titleBlockLinesSmallBgData from '../../assets/title-block-lines-small.svg';

export function TitleBlock() {
  return (
    <section className="overflow-hidden relative pt-[80px] sm:pt-[120px] px-[16px] sm:px-[48px] lg:px-[80px]">
      <div className="uppercase font-serif text-[46px] sm:text-[80px] lg:text-[140px] leading-none font-medium">
        Haqq <br /> Ecosys
        <br className="hidden lg:block xl:hidden" />
        tem <br className="block lg:hidden xl:block" /> Fund
      </div>
      <Link href={'#apply'} className="scroll-smooth" scroll={false}>
        <Button
          variant={2}
          className="z-10 mb-[80px] sm:mb-[120px] mt-[32px] sm:mt-[48px] lg:mt-[64px]"
        >
          Apply
        </Button>
      </Link>

      <Image
        src={sunshineBgData.src}
        alt=""
        height={sunshineBgData.height}
        width={sunshineBgData.width}
        className="absolute bottom-0 left-1/2 z-[0] transform -translate-x-1/2"
      />
      <Image
        src={titleBlockLinesBgData.src}
        alt=""
        height={titleBlockLinesBgData.height}
        width={titleBlockLinesBgData.width}
        className="hidden md:block absolute top-0 right-[-130px] md:right-[-210px] lg:right-[-370px] xl:right-[50px] z-[-1]"
      />
      <Image
        src={titleBlockLinesSmallBgData.src}
        alt=""
        height={titleBlockLinesSmallBgData.height}
        width={titleBlockLinesSmallBgData.width}
        className="block md:hidden absolute top-0 right-0 z-[-1]"
      />
    </section>
  );
}
