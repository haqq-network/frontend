import { Heading, Text, DownloadButton } from '@haqq/website/ui-kit';
import clsx from 'clsx';
import Image from 'next/image';
import bgImageData from '../../assets/title-block-bg-pattern.svg';

export function TitleBlock() {
  return (
    <section
      className={clsx(
        'relative flex flex-col pt-[48px] pl-[16px] sm:pt-[68px] sm:pl-[48px] lg:pl-[80px]',
      )}
    >
      <Image
        src={bgImageData.src}
        alt=""
        width={bgImageData.width}
        height={bgImageData.height}
        priority
        className="absolute top-0 left-1/2 sm:left-0 z-[-1] bg-contain bg-no-repeat scale-[2] sm:scale-100"
      />

      <Heading level={1}>Brand Assets</Heading>
      <Text className="mt-[8px]" size="large">
        Here you can find more Islamic Coin and Haqq logos
      </Text>
      <DownloadButton
        variant={2}
        link="../assets/media-kit.zip"
        withIcon
        className="w-[260px] mt-[24px] sm:mt-[32px]"
      >
        Download Full Pack
      </DownloadButton>
    </section>
  );
}
