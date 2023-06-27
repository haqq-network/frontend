import { Button } from '@haqq/website-ui-kit';
import Image from 'next/image';
import Link from 'next/link';
import sunshineBgData from '../../assets/sunshine.png';
import LinesBgData from '../../assets/title-block-lines.svg';
import LinesSmallBgData from '../../assets/title-block-lines-small.svg';

export function TitleBlock() {
  return (
    <section className="relative overflow-hidden px-[16px] pt-[80px] sm:px-[48px] sm:pt-[120px] lg:px-[80px]">
      <div className="relative z-10">
        <div className="font-serif text-[46px] font-medium uppercase leading-none sm:text-[80px] lg:text-[140px]">
          HAQQ <br /> Ecosystem <br className="block lg:hidden xl:block" /> Fund
        </div>
        <Link href={'#apply'} className="scroll-smooth" scroll={false}>
          <Button
            variant={2}
            className="mb-[80px] mt-[32px] sm:mb-[120px] sm:mt-[48px] lg:mt-[64px]"
          >
            Apply
          </Button>
        </Link>
      </div>

      <Image
        src={sunshineBgData.src}
        alt=""
        height={sunshineBgData.height}
        width={sunshineBgData.width}
        className="absolute bottom-0 left-1/2 z-[0] w-full -translate-x-1/2 transform"
      />
      <Image
        src={LinesBgData.src}
        alt=""
        height={LinesBgData.height}
        width={LinesBgData.width}
        className="absolute right-[-130px] top-0 z-[-1] hidden md:right-[-210px] md:block lg:right-[-370px] xl:right-[50px]"
      />
      <Image
        src={LinesSmallBgData.src}
        alt=""
        height={LinesSmallBgData.height}
        width={LinesSmallBgData.width}
        className="absolute right-0 top-0 z-[-1] block md:hidden"
      />
    </section>
  );
}
