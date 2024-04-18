import { Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  Container,
  Text,
  RatingBadge,
  WalletDownloadButton,
} from '@haqq/islamic-website-ui-kit';
import bgImgData from '../assets/images/wallet-bg.webp';
import phoneImgData from '../assets/images/wallet-iphone-screenshot.webp';

export function WalletPage() {
  const t = useTranslations('wallet-page');

  const content = (
    <Fragment>
      <h1 className="text-[46px] font-[600] leading-[52px] md:text-[80px] md:leading-none lg:text-[80px] lg:leading-none">
        <span className="bg-gradient-to-r from-[#36FFF3] to-[#18FFAC] bg-clip-text text-transparent">
          {t('title.gradient-text')}
        </span>{' '}
        {t('title.white-text')}
      </h1>
      <Text isMono className="mt-[24px] md:mt-[40px]">
        {t('subtitle')}
      </Text>
      <div className="mt-[20px] max-w-[600px] text-[13px] md:mt-[24px] md:text-[16px] lg:text-[#F5F5F580]">
        {t('text')}
      </div>
      <div className="mt-[24px] flex gap-x-[24px] md:mt-[36px] md:gap-x-[38px]">
        <RatingBadge storeName={t('stores.app-store')} rating={4.8} />
        <RatingBadge storeName={t('stores.google-play')} rating={4.9} />
      </div>
      <div className="mt-[28px] flex flex-col gap-x-[16px] gap-y-[20px] md:flex-row lg:mt-[24px] lg:flex-wrap">
        <div className="w-fit">
          <Link
            href="https://apps.apple.com/app/haqq-wallet-by-bored-gen/id6443843352"
            target="_blank"
            rel="noopener noreferrer"
            data-attr="download-ios"
          >
            <WalletDownloadButton
              type="apple"
              title={t('download-button.title')}
            />
          </Link>
        </div>
        <div className="w-fit">
          <Link
            href="https://play.google.com/store/apps/details?id=com.haqq.wallet"
            target="_blank"
            rel="noopener noreferrer"
            data-attr="download-android"
          >
            <WalletDownloadButton
              type="google"
              title={t('download-button.title')}
            />
          </Link>
        </div>
        <div className="w-fit">
          <Link
            href="https://github.com/haqq-network/haqq-wallet/releases/latest/download/haqq.apk"
            target="_blank"
            rel="noopener noreferrer"
            download
            data-attr="download-apk"
          >
            <WalletDownloadButton type="apk" />
          </Link>
        </div>
      </div>
    </Fragment>
  );

  const image = (
    <div className="pointer-events-none select-none">
      <div className="absolute left-[-140px] top-[-60px] z-[-1] h-[600px] w-[600px]">
        <Image src={bgImgData} alt="" priority />
      </div>
      <Image src={phoneImgData} alt="" fill priority />
    </div>
  );

  return (
    <section>
      <Container className="relative mt-[32px] overflow-x-clip pb-[60px] text-white md:mt-[52px] lg:mt-[68px] lg:pb-[130px] xl:pb-[108px]">
        <div className="hidden items-center justify-between lg:flex lg:gap-x-[24px] xl:gap-x-[60px]">
          <div className="flex max-w-[600px] flex-col xl:max-w-[660px]">
            {content}
          </div>
          <div className="flex flex-1 justify-center">
            <div className="relative h-[600px] w-[350px]">{image}</div>
          </div>
        </div>
        <div className="flex flex-col lg:hidden">
          {content}
          <div className="relative mt-[48px] h-[600px] w-[350px] self-center">
            {image}
          </div>
        </div>
      </Container>
    </section>
  );
}
