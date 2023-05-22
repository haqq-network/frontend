import Image from 'next/image';
import LinesBgData from '../../assets/title-block-lines.svg';
import clsx from 'clsx';

export function TitleBlock() {
  return (
    <section
      className={clsx(
        'overflow-hidden relative py-[80px] md:py-[120px] px-[16px] md:px-[48px] lg:px-[80px]',
      )}
    >
      <div className="uppercase font-serif text-[46px] sm:text-[80px] lg:text-[140px] leading-none font-medium">
        HAQQ <br /> Ecosys
        <br className="hidden lg:block xl:hidden" />
        tem
      </div>

      <Image
        src={LinesBgData.src}
        alt=""
        height={LinesBgData.height}
        width={LinesBgData.width}
        className="absolute top-1/2 translate-y-[8.5rem] right-0 scale-[2.5] min-[475px]:scale-[2] min-[475px]:translate-y-[6.5rem] sm:scale-[1.5] sm:translate-y-[2.5rem] md:translate-y-0 md:top-[28px] md:scale-[1] md:right-[-50px] z-[-1]"
      />
    </section>
  );
}
