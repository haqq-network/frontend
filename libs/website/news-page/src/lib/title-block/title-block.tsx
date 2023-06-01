import Image from 'next/image';
import titleBlockBgData from '../../assets/title-block-bg.svg';

export function TitleBlock() {
  return (
    <section className="relative py-[80px] sm:py-[120px] px-[16px] sm:px-[48px] lg:px-[80px] border-b-[1px] border-[#2A2A2B]">
      <div className="uppercase font-serif text-[46px] sm:text-[80px] lg:text-[140px] leading-none font-[500] w-full lg:w-2/3 xl:w-full">
        HAQQ Blog
      </div>

      <Image
        alt=""
        src={titleBlockBgData.src}
        fill
        className="absolute top-0 left-0 z-[-1] h-full w-full object-cover"
      />
    </section>
  );
}
