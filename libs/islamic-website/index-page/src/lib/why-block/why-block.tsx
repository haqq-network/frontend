'use client';
import {
  MemoizedAnimatedNumbers,
  Heading,
  Text,
} from '@haqq/islamic-website-ui-kit';
import Image from 'next/image';
import {
  PropsWithChildren,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import haqqLogoImgData from '../../assets/images/haqq-logo.webp';
import Link from 'next/link';
import clsx from 'clsx';
import { useInViewport } from 'react-in-viewport';
import { useTranslations } from 'next-intl';

export interface ChainStats {
  mainnetAccountsCreated: number;
  transactionsInLast24Hours: number;
  secondsToConsensusFinality: number;
  averageCostPerTransaction: number;
}

function IslamStar() {
  return (
    <svg
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-[28px] w-[28px] md:h-[44px] md:w-[44px]"
    >
      <path
        d="M28.4109 6.12028L28.5341 6.22526L28.6955 6.23814L37.0918 6.90817L37.7619 15.3045L37.7748 15.4659L37.8797 15.5891L43.3431 22L37.8797 28.4109L37.7748 28.5341L37.7619 28.6955L37.0918 37.0918L28.6955 37.7618L28.5341 37.7747L28.4109 37.8797L22 43.3431L15.5891 37.8797L15.4659 37.7747L15.3045 37.7618L6.90816 37.0918L6.23814 28.6955L6.22526 28.5341L6.12028 28.4109L0.656931 22L6.12028 15.5891L6.22526 15.4659L6.23814 15.3045L6.90816 6.90817L15.3045 6.23814L15.4659 6.22526L15.5891 6.12028L22 0.656931L28.4109 6.12028Z"
        stroke="#18FFAC"
      />
    </svg>
  );
}

function DoubleCrescent() {
  return (
    <svg
      viewBox="0 0 44 43"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-[28px] w-[28px] md:h-[44px] md:w-[44px]"
    >
      <path
        d="M36.5863 9.5C39.1078 9.5 41.4475 10.2661 43.3839 11.5763C37.867 11.6433 33.4098 16.1066 33.4098 21.6098C33.4098 27.0054 37.6944 31.4014 43.0615 31.6344C41.1901 32.8157 38.9695 33.5 36.5863 33.5C29.908 33.5 24.5 28.1242 24.5 21.5C24.5 14.8758 29.908 9.5 36.5863 9.5Z"
        stroke="#18FFAC"
      />
      <path
        d="M34.2789 38.7683L34.2789 38.7683C30.8021 41.1208 26.5803 42.5 22.0261 42.5C10.1261 42.5 0.5 33.0867 0.5 21.5001C0.5 9.91333 10.1261 0.5 22.0261 0.5C26.6388 0.5 30.9105 1.91486 34.4125 4.32282L34.6958 3.91081L34.4125 4.32283C34.4711 4.36314 34.4884 4.40082 34.4952 4.42817C34.5035 4.46151 34.5028 4.51088 34.4783 4.56968C34.4277 4.69143 34.3044 4.78997 34.1422 4.78997C24.5991 4.78997 16.8421 12.3446 16.8421 21.6889C16.8421 31.0332 24.5991 38.5878 34.1422 38.5878C34.2214 38.5878 34.2769 38.6335 34.2995 38.6911C34.3102 38.7185 34.3077 38.7354 34.3065 38.7399C34.3062 38.7409 34.3059 38.7419 34.3054 38.7429C34.3049 38.744 34.3042 38.7453 34.3031 38.7468C34.3011 38.7496 34.2948 38.7575 34.2789 38.7683Z"
        stroke="#18FFAC"
      />
    </svg>
  );
}

function Star() {
  return (
    <svg
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-[28px] w-[28px] md:h-[44px] md:w-[44px]"
    >
      <path
        d="M31.2321 14.3217L31.2321 14.3217L41.9237 19.1202C44.0254 20.0635 44.0254 23.0004 41.9237 23.9436L31.2321 28.7421L31.2321 28.7421C30.4315 29.1015 29.7857 29.7316 29.4125 30.5209L24.4436 41.0307L24.8957 41.2444L24.4436 41.0307C23.4772 43.0749 20.5227 43.0749 19.5563 41.0307L14.5874 30.5209C14.2143 29.7316 13.5685 29.1015 12.7679 28.7421L12.7679 28.7421L2.0763 23.9436L1.87157 24.3998L2.0763 23.9436C-0.0254324 23.0004 -0.025433 20.0635 2.0763 19.1202L1.87157 18.664L2.0763 19.1202L12.7679 14.3217L12.7679 14.3217C13.5685 13.9624 14.2143 13.3322 14.5874 12.5429L19.5563 2.03309C20.5227 -0.0110287 23.4772 -0.0110279 24.4436 2.03308L29.4125 12.5429C29.7857 13.3322 30.4315 13.9624 31.2321 14.3217Z"
        stroke="#18FFAC"
      />
    </svg>
  );
}

function CrescentAndStar() {
  return (
    <svg
      viewBox="0 0 44 43"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-[28px] w-[28px] md:h-[43px] md:w-[44px]"
    >
      <path
        d="M34.3878 28.4417C32.6009 29.5796 30.2888 27.9318 30.809 25.7313C31.1103 24.4567 30.6894 23.1114 29.7114 22.256C28.0503 20.8034 28.9624 18.041 31.0763 17.8771C32.3657 17.7771 33.4797 16.9361 33.9638 15.7192L33.9638 15.7192C34.779 13.6695 37.5764 13.6694 38.3917 15.7192C38.8756 16.9361 39.9897 17.7771 41.2791 17.8771C43.393 18.041 44.3051 20.8034 42.644 22.256C41.6659 23.1114 41.2451 24.4567 41.5464 25.7313L41.5464 25.7313C42.0666 27.9318 39.7545 29.5796 37.9676 28.4417C36.8713 27.7434 35.4841 27.7434 34.3878 28.4417ZM34.3878 28.4417L34.6564 28.8634L34.3878 28.4417Z"
        stroke="#18FFAC"
      />
      <path
        d="M34.4774 38.7675L34.7565 39.1824L34.4774 38.7675C30.9803 41.1204 26.7334 42.5 22.1519 42.5C10.1797 42.5 0.5 33.084 0.5 21.5001C0.5 9.91599 10.1797 0.5 22.1519 0.5C26.7922 0.5 31.0893 1.91526 34.6118 4.32357L34.893 3.91233L34.6118 4.32358C34.6714 4.3643 34.6886 4.40211 34.6953 4.42881C34.7034 4.46149 34.7028 4.51025 34.6784 4.56874C34.6278 4.6897 34.5033 4.78998 34.3373 4.78998C24.7439 4.78998 16.9412 12.3419 16.9412 21.6889C16.9412 31.0359 24.7439 38.5878 34.3373 38.5878C34.4199 38.5878 34.4761 38.6353 34.4984 38.692C34.5091 38.719 34.5065 38.7353 34.5054 38.7392C34.5053 38.7397 34.5051 38.7403 34.5049 38.7408C34.5045 38.7421 34.5037 38.7436 34.5022 38.7457C34.5002 38.7485 34.4937 38.7566 34.4774 38.7675Z"
        stroke="#18FFAC"
      />
    </svg>
  );
}

function Reason({ icon, children }: PropsWithChildren<{ icon: ReactNode }>) {
  return (
    <div className="flex items-center gap-x-[8px] min-[375px]:gap-x-[16px]">
      {icon}
      <span className="text-[13px] font-[500] leading-[20px] md:text-[14px] lg:text-base">
        {children}
      </span>
    </div>
  );
}

export function StatisticsBlockStatCard({
  title,
  value,
  startAnimation,
  prefix,
  postfix,
  decimalPlaces,
}: {
  title: string;
  value: number;
  startAnimation: boolean;
  prefix?: string;
  postfix?: string;
  decimalPlaces?: number;
}) {
  return (
    <div className="flex flex-col gap-y-[4px]">
      <div
        className={clsx(
          'rtl:font-handjet ltr:font-vcr pointer-events-none flex h-[34px] select-none gap-x-[6px] text-[24px] leading-[34px]',
        )}
      >
        {prefix}
        {startAnimation ? (
          <MemoizedAnimatedNumbers
            separator={' '}
            animateToNumber={value}
            locale="en-US"
            configs={[
              { mass: 1, tension: 130, friction: 40 },
              { mass: 2, tension: 140, friction: 40 },
              { mass: 3, tension: 130, friction: 40 },
            ]}
            decimalPlaces={decimalPlaces}
          />
        ) : (
          <span>0</span>
        )}
        {postfix}
      </div>
      <div className="text-[12px] lowercase leading-[16px]">{title}</div>
    </div>
  );
}

export function WhyBlock({ mainnetAccounts }: { mainnetAccounts: number }) {
  const [startAnimation, setStartAnimation] = useState(true);
  const blockRef = useRef<HTMLDivElement>(null);
  const { inViewport } = useInViewport(
    blockRef,
    {},
    { disconnectOnLeave: true },
  );
  const stats = useMemo<ChainStats>(() => {
    return {
      mainnetAccountsCreated: mainnetAccounts,
      transactionsInLast24Hours: 210000,
      secondsToConsensusFinality: 5.6,
      averageCostPerTransaction: 0.0005,
    };
  }, [mainnetAccounts]);

  useEffect(() => {
    if (inViewport && !startAnimation) {
      setStartAnimation(true);
    }
  }, [inViewport, startAnimation]);

  const t = useTranslations('index-page.why-block');

  return (
    <div className="bg-islamic-primary-graphite transform-gpu divide-y-[1px] divide-[#2F2F2F] rounded-[20px] px-[20px] py-[28px] text-white backdrop-blur-sm md:p-[40px] lg:mt-[100px] lg:p-[48px]">
      <div className="flex flex-col items-start pb-[40px]">
        <Heading>{t('title')}</Heading>
        <Text isMono className="mt-[12px] md:mt-[20px]">
          {t('subtitle')}
        </Text>
        <div className="mt-[24px] grid w-full grid-cols-1 gap-[24px] sm:grid-cols-2 md:mt-[44px] xl:grid-cols-4">
          <Reason icon={<IslamStar />}>{t('reasons.first')}</Reason>
          <Reason icon={<DoubleCrescent />}>{t('reasons.second')}</Reason>
          <Reason icon={<Star />}>{t('reasons.third')}</Reason>
          <Reason icon={<CrescentAndStar />}>{t('reasons.fourth')}</Reason>
        </div>
      </div>
      <div className="flex flex-col items-start pt-[40px]">
        <div className="flex flex-col gap-x-[24px] gap-y-[12px] sm:flex-row">
          <div className="flex items-center gap-x-[11px]">
            <span className="bg-gradient-to-r from-[#4396BC] to-[#D2754C] bg-clip-text text-[18px] font-[700] leading-[26px] text-transparent md:text-[22px] md:leading-[32px] lg:text-[24px] lg:leading-[34px]">
              {t('counters.title')}
            </span>
            <div className="relative h-[22px] w-[96px] md:h-[28px] md:w-[118px]">
              <Image
                alt="HAQQ"
                src={haqqLogoImgData}
                fill
                className="pointer-events-none select-none"
              />
            </div>
          </div>
          <Link
            href="https://haqq.network"
            target="_blank"
            rel="noopener noreferrer"
            className="text-islamic-primary-green hover:text-islamic-primary-green-hover rtl:font-handjet ltr:font-vcr flex cursor-pointer items-center gap-x-[8px] uppercase transition-colors duration-300 ease-out"
          >
            <span>{t('counters.link')}</span>
            <svg
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.10769 10.6609C8.78225 10.9863 8.78225 11.514 9.10769 11.8394C9.43312 12.1649 9.96076 12.1649 10.2862 11.8394L17.1969 4.92868V7.50016C17.1969 7.9604 17.57 8.3335 18.0303 8.3335C18.4905 8.3335 18.8636 7.9604 18.8636 7.50016L18.8636 2.91698V2.91683C18.8636 2.80294 18.8408 2.69438 18.7994 2.5955C18.7604 2.50214 18.7037 2.41443 18.6293 2.33751L18.6286 2.33675C18.6226 2.33059 18.6165 2.32451 18.6104 2.31854L18.6101 2.31831C18.5331 2.24363 18.4452 2.18676 18.3516 2.1477C18.2527 2.10634 18.1442 2.0835 18.0303 2.0835L13.4469 2.0835C12.9867 2.0835 12.6136 2.45659 12.6136 2.91683C12.6136 3.37707 12.9867 3.75016 13.4469 3.75016L16.0184 3.75016L9.10769 10.6609ZM5.53027 2.50002C4.14956 2.50002 3.03027 3.61931 3.03027 5.00002V15.4167C3.03027 16.7974 4.14956 17.9167 5.53027 17.9167H15.9469C17.3277 17.9167 18.4469 16.7974 18.4469 15.4167V11.25C18.4469 10.7898 18.0738 10.4167 17.6136 10.4167C17.1534 10.4167 16.7803 10.7898 16.7803 11.25V15.4167C16.7803 15.8769 16.4072 16.25 15.9469 16.25H5.53027C5.07004 16.25 4.69694 15.8769 4.69694 15.4167V5.00002C4.69694 4.53979 5.07004 4.16669 5.53027 4.16669H9.69694C10.1572 4.16669 10.5303 3.79359 10.5303 3.33336C10.5303 2.87312 10.1572 2.50002 9.69694 2.50002H5.53027Z"
                fill="currentColor"
              />
            </svg>
          </Link>
        </div>
        <Text size="small" className="mt-[12px] text-white/50">
          {t('counters.subtitle')}
        </Text>
        <div
          ref={blockRef}
          className="mt-[16px] grid w-full gap-[38px] sm:grid-cols-2 md:mt-[20px] lg:mt-[24px] lg:grid-cols-4"
        >
          <StatisticsBlockStatCard
            value={stats.mainnetAccountsCreated}
            title={t('counters.statistic-card.first')}
            startAnimation={startAnimation}
          />
          <StatisticsBlockStatCard
            value={stats.transactionsInLast24Hours}
            title={t('counters.statistic-card.second')}
            startAnimation={startAnimation}
            prefix="~"
          />
          <StatisticsBlockStatCard
            value={stats.secondsToConsensusFinality}
            title={t('counters.statistic-card.third')}
            startAnimation={startAnimation}
            prefix="~"
          />
          <StatisticsBlockStatCard
            value={stats.averageCostPerTransaction}
            title={t('counters.statistic-card.fourth')}
            startAnimation={startAnimation}
            prefix="~"
            postfix="ISLM"
            decimalPlaces={4}
          />
        </div>
      </div>
    </div>
  );
}
