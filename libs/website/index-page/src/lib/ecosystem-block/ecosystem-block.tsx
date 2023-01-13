import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType, Navigation } from 'swiper';
import { useCallback, useEffect, useRef, useState } from 'react';
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
    logoWidth: 0,
    title: '',
    description:
      'Stay tuned to our official channels and get exclusive updates on more platforms joining HAQQ! ',
  },
];

export function EcosystemBlock() {
  const swiperRef = useRef<SwiperType>();
  const [gap, setGap] = useState<number>(12);

  const [isPrevButtonDisabled, setIsPrevButtonDisabled] =
    useState<boolean>(true);
  const [isNextButtonDisabled, setIsNextButtonDisabled] =
    useState<boolean>(false);

  const handlePrev = useCallback(() => {
    if (!swiperRef.current) return;
    swiperRef.current.slidePrev();
    console.log({ swiperRef });
  }, []);

  const handleNext = useCallback(() => {
    if (!swiperRef.current) return;
    swiperRef.current.slideNext();
    console.log({ swiperRef });
  }, []);

  const onSlideChange = () => {
    const swiper = swiperRef.current;
    if (swiper) {
      setIsPrevButtonDisabled(swiper?.isBeginning);
      setIsNextButtonDisabled(swiper?.isEnd);
    }
  };

  useEffect(() => {
    const swiper = swiperRef.current;
    if (swiper) {
      setIsPrevButtonDisabled(swiper?.isBeginning);
      setIsNextButtonDisabled(swiper?.isEnd);
    }
    swiper?.on('slideChange', onSlideChange);
    return () => swiper?.off('slideChange', onSlideChange);
  }, [swiperRef]);

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
    <div className="flex flex-col text-black bg-white">
      <div
        className="text-black ml-[16px] border-l border-[#0D0D0E/24] pt-[60px] pb-[72px]"
        id="ecosystem"
      >
        <div className="ml-[16px] mr-[32px] sm:ml-[141px]">
          <Heading
            level={2}
            className={clsx(' mb-[16px] relative title', styles['title'])}
          >
            HAQQ ecosystem
          </Heading>

          <Text
            size="small"
            className="mb-[24px] mr-[32px] sm:mr-[65px] lg:mr-[318px]"
          >
            HAQQ provides an ethics-driven, Ethereum compatible, fast finality
            tech stack to build your next unicorn. Robust, versatile and
            socially responsible solutions ready for the Digital Age.
          </Text>
        </div>
        <div className="flex space-x-[8px] mb-[16px] mr-[17px] sm:mb-[24px] sm:mr-[65px] lg:mr-[81px] justify-end">
          <ArrowButton
            directionLeft
            onClick={handlePrev}
            disabled={isPrevButtonDisabled}
          />
          <ArrowButton onClick={handleNext} disabled={isNextButtonDisabled} />
        </div>
        <Swiper
          slidesPerView={'auto'}
          centeredSlides={true}
          navigation={true}
          modules={[Navigation]}
          className="ecosystemSwiper"
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          spaceBetween={gap}
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
        </Swiper>
      </div>
    </div>
  );
}
