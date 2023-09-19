import Image from 'next/image';
import linesBgData from '../assets/images/header-title-block-lines.svg';
import clsx from 'clsx';
import { Partner, PartnersBlock } from './partners-block/partners-block';
import { EcosystemPageApplyBlock } from './ecosystem-page-apply-block/ecosystem-page-apply-block';

export function EcosystemPage({ partners }: { partners: Partner[] }) {
  return (
    <section className="overflow-x-clip">
      <div
        className={clsx(
          'relative overflow-hidden px-[16px] py-[80px] md:px-[48px] md:py-[120px] lg:px-[80px]',
        )}
      >
        <div className="font-serif text-[46px] font-medium uppercase leading-none sm:text-[80px] lg:text-[140px]">
          HAQQ <br /> Ecosys
          <br className="hidden lg:block xl:hidden" />
          tem
        </div>

        <Image
          alt=""
          priority
          src={linesBgData}
          className="absolute right-0 top-1/2 z-[-1] translate-y-[8.5rem] scale-[2.5] min-[475px]:translate-y-[6.5rem] min-[475px]:scale-[2] sm:translate-y-0 sm:scale-[1.5] md:right-[-50px] md:top-0 md:scale-[1]"
        />
      </div>

      <EcosystemPageApplyBlock />

      <PartnersBlock partners={partners} />
    </section>
  );
}
