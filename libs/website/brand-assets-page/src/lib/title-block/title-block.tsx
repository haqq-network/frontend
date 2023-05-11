import { Heading, Text, DownloadButton } from '@haqq/website/ui-kit';
import clsx from 'clsx';
import Image from 'next/image';
import bgImageData from '../../assets/title-block-bg.svg';

export function TitleBlock() {
  return (
    <section
      className={clsx(
        'relative flex flex-col px-[16px] pt-[48px] sm:px-[48px] sm:pt-[68px] lg:px-[80px]',
      )}
    >
      <Image
        src={bgImageData.src}
        alt=""
        width={bgImageData.width}
        height={bgImageData.height}
        priority
        className="absolute left-1/2 top-0 z-[-1] scale-[2] bg-contain bg-no-repeat sm:left-0 sm:scale-100"
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
