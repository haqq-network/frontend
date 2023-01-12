import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useCallback, useEffect, useState } from 'react';
import { FeatureCard, Heading, Text } from '@haqq/website/ui-kit';

const FeaturesData = [
  {
    img: './feature-img-1.svg',
    description:
      'Solidity developers can build smart contracts with familiar, time-proven stack and migrate any smart contracts, deployed on other EVM networks like Ethereum, on HAQQ without rewriting a single line of code',
    title: 'EVM-compatible',
    imgClassName:
      '!left-[10px] !top-[10px] scale-[1.15] lg:!top-0 lg:!left-0 lg:scale-100',
  },
  {
    img: './feature-img-2.svg',
    description:
      'Immutable on-chain ethical audit and verification based on disruptive soulbond tokens technology',
    title: 'On-chain ethical audit',
  },
  {
    img: './feature-img-3.svg',
    description:
      'HAQQ is interoperable with other networks via IBC protocol – feature of the Cosmos SDK which Haqq Network is built on',
    title: 'IBC protocol',
  },
  {
    img: './feature-img-4.svg',
    description:
      'Halal Defi Marketplace targeting the audience of 1.1+ billion Muslim people online. HAQQ Wallet assures ethical Web3 builders will reach out to non crypto-savvy people concerned about sustainable finance.',
    title: 'Haqq Wallet',
  },
];

export function FeaturesBlock() {
  const [gap, setGap] = useState<number>(12);

  const pagination = {
    clickable: true,
    renderBullet: function (index: number, className: string) {
      return `<div class=${className}>0${index + 1}</div>`;
    },
  };

  const handleResize = useCallback(() => {
    if (window.innerWidth >= 1024) {
      setGap(28);
    } else if (window.innerWidth >= 640) {
      setGap(20);
    } else {
      setGap(12);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  return (
    <div className="text-black border-t-black bg-white flex flex-col border-b">
      <div
        className="text-black pr-[32px] ml-[16px] sm:pl-0 sm:ml-[63px] sm:mr-0 sm:pr-0 lg:ml-[79px] border-l border-[#0D0D0E/24] pb-[60px] sm:pb-0"
        id="features"
      >
        <div className="flex flex-col ">
          <div className="flex flex-col sm:flex-row mb-[32px] sm:mb-[40px] sm:space-x-[40px] lg:space-x-[305px] ml-[16px]">
            <div className="pt-[60px] sm:pt-[96px] lg:pt-[121px] sm:pl-[20px] lg:pl-[32px] sm:w-[241px] lg:w-[289px]">
              <Heading level={2}>Features for ethical builders</Heading>
            </div>
            <div className="pt-[16px] sm:pt-[100px] lg:pt-[132px] sm:pr-[64px] xl:pr-[199px] flex-1 ">
              <Text className="sm:ml-[20px] lg:ml-[32px]">
                HAQQ is a fast Proof-of-stake network built with the Tendering
                consensus engine, with fast finality. It means that transaction
                effects become irreversible and can't be altered immediately
                after block inclusion.
              </Text>
            </div>
          </div>
          <Swiper
            pagination={pagination}
            modules={[Pagination]}
            slidesPerView={'auto'}
            spaceBetween={gap}
            className="featuresSwiper"
          >
            {FeaturesData.map((el, index) => (
              <SwiperSlide key={index}>
                <FeatureCard
                  description={el.description}
                  title={el.title}
                  img={el.img}
                  imgClassName={el.imgClassName}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
