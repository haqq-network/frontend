import { Heading, Text } from '@haqq/ui-kit';
import clsx from 'clsx';
import Image from 'next/image';
import { CustomImage, haqqLogos } from '../../utils/brand-assets';
import { DownloadButton } from '@haqq/website/ui-kit';
import { PropsWithChildren } from 'react';

type DownloadCardProps = {
  isWhiteBackground?: boolean;
  logoType: 'full' | 'sign' | 'text';
  asset: CustomImage;
};

function DontBlock() {
  return (
    <div className="bg-[#EC5728] px-[16px] py-[20px] rounded-lg text-[11px] leading-[17px] md:leading-[1.5em] lg:text-[12px]">
      Please don’t
      <ul className="list-disc ml-[16px]">
        <li className="">Alter these files in any way.</li>
        <li>
          Use these graphics as part of your own product, business, or service’s
          name.
        </li>
        <li>
          Combine these graphics with any other graphics without our written
          consent
        </li>
      </ul>
    </div>
  );
}

function DownloadCard({
  isWhiteBackground = false,
  logoType,
  asset,
}: DownloadCardProps) {
  return (
    <div className="flex flex-col gap-y-[16px] max-w-full ">
      <div
        className={clsx(
          'flex items-center justify-center rounded-xl h-[140px]',
          isWhiteBackground ? 'bg-white' : 'bg-black',
        )}
      >
        <Image
          className="max-w-fit pointer-events-none select-none"
          src={asset.svgPath}
          width={asset.size.width}
          height={asset.size.height}
          alt="logo"
          key="BrandAssetCard"
          priority={true}
        />
      </div>
      <div className="flex items-center justify-between text-[12px] leading-[1.5em] text-white/50">
        {logoType === 'full' && 'Full logo'}
        {logoType === 'sign' && 'Sign'}
        {logoType === 'text' && 'Text logo'}
        <div className="flex gap-x-[12px]">
          <DownloadButton className="w-[70px]" link={asset.svgPath}>
            SVG
          </DownloadButton>
          <DownloadButton className="w-[70px]" link={asset.pngPath}>
            PNG
          </DownloadButton>
        </div>
      </div>
    </div>
  );
}

function AssetCardsContainer({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={clsx(
        'grid grid-flow-row grid-cols-1 md:grid-cols-2 gap-y-[24px] md:gap-[36px] lg:gap-y-[36px] xl:gap-x-[58px] border-white/20',
        className,
      )}
    >
      {children}
    </div>
  );
}

function BlockContainer({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={clsx(
        'pt-[60px] md:pt-[100px] lg:pt-[120px] pb-[40px] md:pb-[60px] lg:pb-[80px] px-[16px] md:px-[48px] lg:px-[60px]',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function HaqqBlock() {
  return (
    <section className="lg:flex border-t border-white/20 grid grid-flow-row grid-cols-1 lg:grid-cols-2 mt-[50px] md:mt-[70px]">
      <BlockContainer className="lg:border-r border-white/20 lg:max-w-[404px]">
        <Heading level={2} className="mb-[24px]">
          Haqq Logo
        </Heading>
        <DontBlock />
      </BlockContainer>
      <BlockContainer className="border-b border-dashed border-b-white/20">
        <Heading>White background</Heading>
        <Text className="mt-[10px]">
          Please use this version on white background. Only use the badge
          together with the full logo
        </Text>
        <AssetCardsContainer className="mt-[24px] md:mt-[28px] lg:mt-[32px]">
          {haqqLogos.map((logo, i) => (
            <DownloadCard
              key={`logo-${i}`}
              isWhiteBackground={true}
              logoType={logo.logoType}
              asset={logo}
            />
          ))}
        </AssetCardsContainer>
      </BlockContainer>
    </section>
  );
}
