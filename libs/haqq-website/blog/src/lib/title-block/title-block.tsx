import Image from 'next/image';
import titleBlockBgData from '../../assets/title-block-bg.svg';

export function BlogPageHeader() {
  return (
    <section className="relative border-b-[1px] border-[#2A2A2B] px-[16px] py-[80px] sm:px-[48px] sm:py-[120px] lg:px-[80px]">
      <div className="w-full font-serif text-[46px] font-[500] uppercase leading-none sm:text-[80px] lg:w-2/3 lg:text-[140px] xl:w-full">
        HAQQ Blog
      </div>

      <Image
        alt=""
        fill
        src={titleBlockBgData}
        className="absolute left-0 top-0 z-[-1] h-full w-full object-cover"
      />
    </section>
  );
}
