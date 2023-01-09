import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FeatureCard, Heading, Text } from '@haqq/website/ui-kit';
import firstFeatureData from '../../assets/images/features/1.svg';
import secondFeatureData from '../../assets/images/features/2.svg';

const FeaturesData = [
  {
    img: firstFeatureData,
    description:
      'Solidity developers can build smart contracts with familiar, time-proven stack and migrate any smart contracts, deployed on other EVM networks like Ethereum, on HAQQ without rewriting a single line of code',
    title: 'EVM-compatible',
  },
  {
    img: secondFeatureData,
    description:
      'Solidity developers can build smart contracts with familiar, time-proven stack and migrate any smart contracts, deployed on other EVM networks like Ethereum, on HAQQ without rewriting a single line of code',
    title: 'EVM-compatible',
  },
  {
    img: secondFeatureData,
    description:
      'Solidity developers can build smart contracts with familiar, time-proven stack and migrate any smart contracts, deployed on other EVM networks like Ethereum, on HAQQ without rewriting a single line of code',
    title: 'EVM-compatible',
  },
  {
    img: secondFeatureData,
    description:
      'Solidity developers can build smart contracts with familiar, time-proven stack and migrate any smart contracts, deployed on other EVM networks like Ethereum, on HAQQ without rewriting a single line of code',
    title: 'EVM-compatible',
  },
];

export function FeaturesBlock() {
  const pagination = {
    clickable: true,
    renderBullet: function (index: number, className: string) {
      return `<div class=${className}>0${index + 1}</div>`;
    },
  };

  return (
    <div className="text-black border-t-black bg-white flex flex-col border-b">
      <div
        className="text-black pl-[16px] pr-[32px] ml-[16px] sm:pl-0 sm:ml-[63px] sm:mr-0 sm:pr-0 lg:ml-[79px] border-l border-[#0D0D0E/24] pb-[60px] sm:pb-0"
        id="features"
      >
        <div className="flex flex-col">
          <div className="flex flex-col sm:flex-row mb-[32px] sm:mb-[40px] sm:space-x-[40px] lg:space-x-[305px]">
            <div className="pt-[60px] sm:pt-[96px] lg:pt-[121px] sm:pl-[20px] lg:pl-[32px] sm:w-[241px] lg:w-[289px]">
              <Heading level={2}>Features for ethical builders</Heading>
            </div>
            <div className="pt-[16px] sm:pt-[100px] lg:pt-[132px] sm:pr-[64px] xl:pr-[199px]  flex-1 ">
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
            className={'mySwiper'}
            slidesPerView={'auto'}
            centeredSlides={true}
          >
            {FeaturesData.map((el, index) => (
              <SwiperSlide key={index}>
                <FeatureCard
                  description={el.description}
                  title={el.title}
                  img={el.img}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
