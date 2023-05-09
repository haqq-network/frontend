import { Heading, Text, DownloadButton } from '@haqq/website/ui-kit';
import clsx from 'clsx';
import Image from 'next/image';
import bgImageData from '../../assets/title-block-bg.svg';

export function TitleBlock() {
  return (
    <section
      className={clsx(
        'relative flex flex-col pt-[48px] px-[16px] sm:pt-[68px] sm:px-[48px] lg:px-[80px]',
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
        Here you can find more Islamic Coin and HAQQ logos
      </Text>

      <div className="mt-[24px] sm:mt-[32px]">
        <DownloadButton variant={2} link="../assets/media-kit.zip" withIcon>
          Download Full Pack
        </DownloadButton>
      </div>
    </section>
  );
}
