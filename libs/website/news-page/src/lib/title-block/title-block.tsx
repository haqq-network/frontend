import Image from 'next/image';
import titleBlockBgData from '../../assets/title-block-bg.svg';

export function TitleBlock() {
  return (
    <section className="relative py-[80px] sm:py-[120px] px-[16px] sm:px-[48px] lg:px-[80px]">
      <Image
        alt=""
        src={titleBlockBgData.src}
        fill
        className="absolute top-0 left-0 z-[-1] h-full w-full object-cover"
      />
      <div className="uppercase font-serif text-[46px] sm:text-[80px] lg:text-[140px] leading-none font-medium">
        Haqq
        <br className="hidden lg:block xl:hidden" />
        news
      </div>
    </section>
  );
}
