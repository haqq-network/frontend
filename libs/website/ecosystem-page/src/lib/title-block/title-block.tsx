import Image from 'next/image';
import LinesBgData from '../../assets/title-block-lines.svg';

export function TitleBlock() {
  return (
    <section className="overflow-hidden relative py-[80px] sm:py-[120px] px-[16px] sm:px-[48px] lg:px-[80px]">
      <div className="relative z-10">
        <div className="uppercase font-serif text-[46px] sm:text-[80px] lg:text-[140px] leading-none font-medium">
          HAQQ <br /> Ecosystem
        </div>
      </div>

      <Image
        src={LinesBgData.src}
        alt=""
        height={614}
        width={888}
        className="hidden md:block absolute top-0 right-[-68px] z-[-1]"
      />
    </section>
  );
}
