import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import {
  Heading,
  Text,
  ArrowButton,
  EcosystemCard,
} from '@haqq/website/ui-kit';
import styles from './ecosystem-block.module.css';

const EcosystemData = [
  {
    backgroundImg: '/ecosystem-img-1.png',
    title: 'Dexpad.io',
    logo: '/dexpad-logo.svg',
    description:
      'Dexpad is a platform that integrates automatic anti-scam mechanisms and embeds presale rules while democratizing the investment process.',
  },
  {
    backgroundImg: '/ecosystem-img-2.png',
    title: 'Photonswap.finance',
    logo: '/photonswap-logo.svg',
    description:
      'Photonswap is a decentralized exchange (DEX), providing liquidity and enabling peer-to-peer transactions on Cronos Chain. ',
  },
  {
    backgroundImg: '',
    logo: '',
    title: '',
    description:
      'Stay tuned to our official channels and get exclusive updates on more platforms joining HAQQ! ',
  },
];

export function EcosystemBlock() {
  return (
    <div className="flex flex-col text-black bg-white">
      <div
        className="text-black ml-[16px] sm:ml-[63px] lg:ml-[79px] border-l border-[#0D0D0E/24] pt-[60px] pb-[72px]"
        id="ecosystem"
      >
        <div className={clsx('mr-[32px] sm:ml-[121px] lg:ml-[45%] relative')}>
          <Heading
            level={2}
            className={clsx(
              'mb-[16px] relative pl-[11px] sm:pl-[20px] lg:pl-[27px]',
              styles['title'],
            )}
          >
            HAQQ ecosystem
          </Heading>
          <div className="pl-[11px] sm:pl-[20px] lg:pl-[27px]">
            <Text size="small" className="mb-[24px] mr-[32px]">
              HAQQ provides an ethics-driven, Ethereum compatible, fast finality
              tech stack to build your next unicorn. Robust, versatile and
              socially responsible solutions ready for the Digital Age.
            </Text>
          </div>
        </div>

        <Swiper
          className="ecosystemSwiper"
          breakpoints={{
            0: {
              slidesPerView: 1.25,
              spaceBetween: 12,
            },
            640: {
              slidesPerView: 1.5,
              spaceBetween: 20,
            },

            1024: {
              slidesPerView: 2.5,
              spaceBetween: 28,
            },
          }}
        >
          {EcosystemData.map((el, index) => (
            <SwiperSlide key={index}>
              <EcosystemCard
                backgroundImg={el.backgroundImg}
                logo={el.logo}
                title={el.title}
                description={el.description}
              />
            </SwiperSlide>
          ))}

          <span slot="container-start">
            <div className="flex space-x-[8px] mb-[16px] mr-[17px] sm:mb-[24px] sm:mr-[65px] lg:mr-[81px] justify-end">
              <SliderNavButton direction="prev" />
              <SliderNavButton direction="next" />
            </div>
          </span>
        </Swiper>
      </div>
    </div>
  );
}

function SliderNavButton({ direction }: { direction: 'prev' | 'next' }) {
  const swiper = useSwiper();
  const [disabled, setDisabled] = useState(direction === 'prev' ? true : false);

  useEffect(() => {
    swiper.on('slideChange', (swiper) => {
      if (direction === 'prev' && swiper.isBeginning) {
        setDisabled(true);
      } else if (direction === 'next' && swiper.isEnd) {
        setDisabled(true);
      } else {
        setDisabled(false);
      }
    });
  }, [direction, swiper]);

  return (
    <ArrowButton
      directionLeft={direction === 'prev'}
      onClick={() => {
        direction === 'prev' ? swiper.slidePrev() : swiper.slideNext();
      }}
      disabled={disabled}
    />
  );
}
