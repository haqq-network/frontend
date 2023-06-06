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
import { Button, DownloadButton, Heading, Text } from '@haqq/website/ui-kit';
import { PropsWithChildren, useCallback, useState } from 'react';

interface DownloadCardProps {
  isWhiteBackground: boolean;
  logoType: LogoType;
  asset: CustomImage;
}

function DontBlock() {
  return (
    <div className="bg-haqq-orange rounded-lg px-[16px] py-[20px] text-[11px] leading-[17px] md:leading-[1.5em] lg:text-[12px]">
      Please don’t
      <ul className="ml-[16px] list-disc">
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
    <div className="flex max-w-full flex-col gap-y-[16px] ">
      <div
        className={clsx(
          'flex h-[140px] items-center justify-center rounded-xl',
          isWhiteBackground ? 'bg-white' : 'bg-black',
        )}
      >
        <Image
          className="pointer-events-none max-w-fit select-none"
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
          'rounded-xl py-[60px] text-center text-[14px] font-semibold leading-[22px]',
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
        'grid grid-flow-row grid-cols-1 gap-y-[24px] border-white/20 md:grid-cols-2 md:gap-[36px] lg:gap-y-[36px] xl:gap-x-[58px]',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function HaqqBlock() {
  return (
    <section className="flex flex-col border-t border-white/20 lg:flex-row">
      <div className="border-white/20 px-[16px] pt-[60px] md:px-[48px] md:pt-[100px] lg:max-w-[404px] lg:border-r lg:pl-[80px] lg:pr-[60px] lg:pt-[120px]">
        <Heading level={2} className="mb-[24px]">
          HAQQ Logo
        </Heading>
        <DontBlock />
      </div>

      <div className="w-full">
        <div className="border-b border-dashed border-b-white/20 px-[16px] pt-[40px] md:px-[48px] md:pt-[60px] lg:px-[80px] lg:pl-[60px] lg:pt-[120px] xl:pr-[320px]">
          <Heading>White background</Heading>
          <Text className="mt-[10px]">
            Please use this version on white background. Only use the badge
            together with the full logo
          </Text>
          <AssetCardsContainer className="mt-[24px] pb-[40px] md:mt-[28px] md:pb-[60px] lg:mt-[32px] lg:pb-[80px]">
            {haqqLogos.map((logo, i) => {
              return (
                <DownloadCard
                  key={`logo-${i}`}
                  isWhiteBackground
                  logoType={logo.logoType}
                  asset={logo}
                />
              );
            })}
          </AssetCardsContainer>
        </div>

        <div className="w-full border-b border-dashed border-b-white/20 px-[16px] pt-[40px] md:px-[48px] md:pt-[60px] lg:px-[80px] lg:pl-[60px] lg:pt-[80px] xl:pr-[320px]">
          <Heading>Dark background</Heading>
          <Text className="mt-[10px]">
            Please use this version on black or dark background. Only use the
            badge together with the full logo
          </Text>
          <AssetCardsContainer className="mt-[24px] pb-[40px] md:mt-[28px] md:pb-[60px] lg:mt-[32px] lg:pb-[80px]">
            {haqqWhiteLogos.map((logo, i) => {
              return (
                <DownloadCard
                  key={`logo-${i}`}
                  logoType={logo.logoType}
                  asset={logo}
                  isWhiteBackground={false}
                />
              );
            })}
          </AssetCardsContainer>
        </div>

        <div className="w-full px-[16px] pt-[40px] md:px-[48px] md:pt-[60px] lg:px-[80px] lg:pl-[60px] lg:pt-[80px] xl:pr-[320px]">
          <Heading>Brand colors</Heading>
          <AssetCardsContainer className="mt-[24px] pb-[40px] md:mt-[28px] md:pb-[60px] lg:mt-[32px] lg:pb-[80px]">
            {haqqBrandColors.map((asset) => {
              return (
                <BrandColorCard
                  key={`color-${asset.color}`}
                  color={asset.color}
                  colorType={asset.colorType}
                  hex={asset.hex}
                />
              );
            })}
          </AssetCardsContainer>
        </div>
      </div>
    </section>
  );
}

export function IslamicBlock() {
  return (
    <section className="flex flex-col border-t border-white/20 lg:flex-row">
      <div className="border-white/20 px-[16px] pt-[60px] md:px-[48px] md:pt-[100px] lg:max-w-[404px] lg:border-r lg:pl-[80px] lg:pr-[60px] lg:pt-[120px]">
        <Heading level={2} className="mb-[24px]">
          Islamic Coin
        </Heading>
        <DontBlock />
      </div>

      <div className="w-full">
        <div className="border-b border-dashed border-b-white/20 px-[16px] pt-[40px] md:px-[48px] md:pt-[60px] lg:px-[80px] lg:pl-[60px] lg:pt-[120px] xl:pr-[320px]">
          <Heading>White background</Heading>
          <Text className="mt-[10px]">
            Although the official brand name contains a space in text, we use no
            spacing in the logo. Please follow the rules
          </Text>
          <AssetCardsContainer className="mt-[24px] pb-[40px] md:mt-[28px] md:pb-[60px] lg:mt-[32px] lg:pb-[80px]">
            {islamicLogos.map((logo, i) => {
              return (
                <DownloadCard
                  key={`logo-${i}`}
                  isWhiteBackground
                  logoType={logo.logoType}
                  asset={logo}
                />
              );
            })}
          </AssetCardsContainer>
        </div>

        <div className="w-full px-[16px] pt-[40px] md:px-[48px] md:pt-[60px] lg:px-[80px] lg:pl-[60px] lg:pt-[80px] xl:pr-[320px]">
          <Heading>Brand colors</Heading>
          <AssetCardsContainer className="mt-[24px] pb-[40px] md:mt-[28px] md:pb-[60px] lg:mt-[32px] lg:pb-[80px]">
            {islamicBrandColors.map((asset) => {
              return (
                <BrandColorCard
                  key={`color-${asset.color}`}
                  color={asset.color}
                  colorType={asset.colorType}
                  hex={asset.hex}
                />
              );
            })}
          </AssetCardsContainer>
        </div>
      </div>
    </section>
  );
}
