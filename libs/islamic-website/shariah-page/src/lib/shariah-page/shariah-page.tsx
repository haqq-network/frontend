import { Fragment } from 'react';
import { HeroBlock } from '../hero-block/hero-block';
import { FatwaBlock } from '../fatwa-block/fatwa-block';
import fatwaStarsImgData from '../../assets/images/fatwa-stars.webp';
import Image from 'next/image';

export function ShariahPage() {
  return (
    <Fragment>
      <div className="relative">
        <div className="absolute right-0 top-[-104px] z-[-1] h-[400px] w-[235px] md:h-[742px] md:w-[437px] lg:top-[-132px] lg:h-[1483px] lg:w-[874px]">
          <Image src={fatwaStarsImgData} alt="" fill />
        </div>
      </div>
      <HeroBlock />
      <FatwaBlock />
    </Fragment>
  );
}
