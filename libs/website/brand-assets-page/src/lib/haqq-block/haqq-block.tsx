import { Heading, Text } from '@haqq/ui-kit';
import clsx from 'clsx';
import Image from 'next/image';
import {
  BrandColorAsset,
  CustomImage,
  LogoType,
  haqqBrandColors,
  haqqLogos,
  haqqWhiteLogos,
  islamicBrandColors,
  islamicLogos,
} from '../../utils/brand-assets';
import { Button, DownloadButton } from '@haqq/website/ui-kit';
import { PropsWithChildren, useCallback, useState } from 'react';

interface DownloadCardProps {
  isWhiteBackground: boolean;
  logoType: LogoType;
  asset: CustomImage;
}

function DontBlock() {
  return (
    <div className="bg-haqq-orange px-[16px] py-[20px] rounded-lg text-[11px] leading-[17px] md:leading-[1.5em] lg:text-[12px]">
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
        {logoType === 'mark' && 'ISLM mark'}
        <div className="flex gap-x-[12px]">
          <DownloadButton className="!px-[12px]" link={asset.svgPath}>
            SVG
          </DownloadButton>
          <DownloadButton className="!px-[12px]" link={asset.pngPath}>
            PNG
          </DownloadButton>
        </div>
      </div>
    </div>
  );
}

function BrandColorCard({ color, colorType, hex }: BrandColorAsset) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = useCallback(() => {
    navigator.clipboard.writeText(hex);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }, [hex]);

  return (
    <div className="flex flex-col gap-y-[16px]">
      <div
        className={clsx(
          'rounded-xl text-center text-[14px] leading-[22px] py-[60px] font-semibold',
          color === 'haqq-orange' && 'bg-haqq-orange',
          color === 'haqq-blue' && `bg-[#091D53]`,
          color === 'haqq-seaweed' && 'bg-[#157C83]',
          color === 'haqq-big-foot-feet' && 'bg-[#E98C50]',
          color === 'haqq-azure' && 'bg-[#ECFEFE]',
          color === 'islamic-primary' && 'bg-[#04D484]',
          color === 'haqq-azure' ? 'text-haqq-black' : 'text-white',
        )}
      >
        <div>{hex}</div>
      </div>
      <div className="flex items-center justify-between text-[12px] leading-[1.5em] text-white/50">
        {colorType === 'gradient' && 'Gradient color'}
        {colorType === 'main' && 'Main color'}
        <Button onClick={handleCopyClick}>
          {isCopied ? 'Copied!' : 'Copy'}
        </Button>
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

export function HaqqBlock() {
  return (
    <section className="flex flex-col lg:flex-row border-t border-white/20">
      {/* left side */}
      <div className="pt-[60px] md:pt-[100px] lg:pt-[120px] lg:border-r border-white/20 lg:max-w-[404px] px-[16px] md:px-[48px] lg:pl-[80px] lg:pr-[60px]">
        <Heading level={2} className="mb-[24px]">
          HAQQ Logo
        </Heading>
        <DontBlock />
      </div>
      {/* white bg */}
      <div className="w-full">
        <div className="lg:pl-[60px] pt-[40px] md:pt-[60px] lg:pt-[120px] border-b border-dashed border-b-white/20 px-[16px] md:px-[48px] lg:px-[80px] xl:pr-[320px]">
          <Heading>White background</Heading>
          <Text className="mt-[10px]">
            Please use this version on white background. Only use the badge
            together with the full logo
          </Text>
          <AssetCardsContainer className="pb-[40px] md:pb-[60px] lg:pb-[80px] mt-[24px] md:mt-[28px] lg:mt-[32px]">
            {haqqLogos.map((logo, i) => (
              <DownloadCard
                key={`logo-${i}`}
                isWhiteBackground
                logoType={logo.logoType}
                asset={logo}
              />
            ))}
          </AssetCardsContainer>
        </div>
        {/* dark bg */}
        <div className="w-full lg:pl-[60px] pt-[40px] md:pt-[60px] lg:pt-[80px] border-b border-dashed border-b-white/20 px-[16px] md:px-[48px] lg:px-[80px] xl:pr-[320px]">
          <Heading>Dark background</Heading>
          <Text className="mt-[10px]">
            Please use this version on black or dark background. Only use the
            badge together with the full logo
          </Text>
          <AssetCardsContainer className="pb-[40px] md:pb-[60px] lg:pb-[80px] mt-[24px] md:mt-[28px] lg:mt-[32px]">
            {haqqWhiteLogos.map((logo, i) => (
              <DownloadCard
                key={`logo-${i}`}
                logoType={logo.logoType}
                asset={logo}
                isWhiteBackground={false}
              />
            ))}
          </AssetCardsContainer>
        </div>
        {/* colors */}
        <div className="w-full lg:pl-[60px] pt-[40px] md:pt-[60px] lg:pt-[80px] px-[16px] md:px-[48px] lg:px-[80px] xl:pr-[320px]">
          <Heading>Brand colors</Heading>
          <AssetCardsContainer className="pb-[40px] md:pb-[60px] lg:pb-[80px] mt-[24px] md:mt-[28px] lg:mt-[32px]">
            {haqqBrandColors.map((asset) => (
              <BrandColorCard
                key={`color-${asset.color}`}
                color={asset.color}
                colorType={asset.colorType}
                hex={asset.hex}
              />
            ))}
          </AssetCardsContainer>
        </div>
      </div>
    </section>
  );
}

export function IslamicBlock() {
  return (
    <section className="flex flex-col lg:flex-row border-t border-white/20">
      {/* left side */}
      <div className="pt-[60px] md:pt-[100px] lg:pt-[120px] lg:border-r border-white/20 lg:max-w-[404px] px-[16px] md:px-[48px] lg:pl-[80px] lg:pr-[60px]">
        <Heading level={2} className="mb-[24px]">
          Islamic Coin
        </Heading>
        <DontBlock />
      </div>
      {/* islamic */}
      <div className="w-full">
        <div className="lg:pl-[60px] pt-[40px] md:pt-[60px] lg:pt-[120px] border-b border-dashed border-b-white/20 px-[16px] md:px-[48px] lg:px-[80px] xl:pr-[320px]">
          <Heading>White background</Heading>
          <Text className="mt-[10px]">
            Although the official brand name contains a space in text, we use no
            spacing in the logo. Please follow the rules
          </Text>
          <AssetCardsContainer className="pb-[40px] md:pb-[60px] lg:pb-[80px] mt-[24px] md:mt-[28px] lg:mt-[32px]">
            {islamicLogos.map((logo, i) => (
              <DownloadCard
                key={`logo-${i}`}
                isWhiteBackground
                logoType={logo.logoType}
                asset={logo}
              />
            ))}
          </AssetCardsContainer>
        </div>
        {/* colors */}
        <div className="w-full lg:pl-[60px] pt-[40px] md:pt-[60px] lg:pt-[80px] px-[16px] md:px-[48px] lg:px-[80px] xl:pr-[320px]">
          <Heading>Brand colors</Heading>
          <AssetCardsContainer className="pb-[40px] md:pb-[60px] lg:pb-[80px] mt-[24px] md:mt-[28px] lg:mt-[32px]">
            {islamicBrandColors.map((asset) => (
              <BrandColorCard
                key={`color-${asset.color}`}
                color={asset.color}
                colorType={asset.colorType}
                hex={asset.hex}
              />
            ))}
          </AssetCardsContainer>
        </div>
      </div>
    </section>
  );
}
