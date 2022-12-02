import { Text, Button, HeroHeading } from '@haqq/website/ui-kit';
import Image from 'next/image';
import sunriseImageData from '../../assets/sunrise.png';
import halfEclipseImageData from '../../assets/half-eclipse.png';

function SunriseBackground() {
  return (
    <div className="absolute inset-0 lg:translate-y-[100px] z-[-1]">
      <Image
        alt=""
        src={sunriseImageData.src}
        height={sunriseImageData.height}
        width={sunriseImageData.width}
        className="z-[-1] absolute bottom-0 w-full scale-125 origin-bottom"
      />
      <Image
        alt=""
        src={halfEclipseImageData.src}
        height={halfEclipseImageData.height}
        width={halfEclipseImageData.width}
        className="z-[-1] absolute bottom-[-2px] left-0 w-full"
      />
    </div>
  );
}

export function HeroBlock() {
  return (
    <div className="border-b border-haqq-border relative">
      <div className="sm:ml-[63px] lg:ml-[79px] px-[16px] sm:pl-[20px] lg:pl-[32px] sm:border-l border-haqq-border h-[440px] sm:h-[610px] lg:h-[748px] flex flex-col justify-center items-start sm:pr-[64px] lg:pr-[58px] z-10">
        <HeroHeading>
          Home of <br /> ethical web3
        </HeroHeading>
        <div className="mt-[32px] lg:max-w-[700px]">
          <Text size="large">
            Ethics-first network that welcomes sustainability-centered
            developers, validators and open source contributors as well as
            Muslim innovators in sustainable Finance
          </Text>
        </div>
        <div className="mt-[48px] sm:mt-[62px] lg:mt-[64px]">
          <Button variant={2} className="w-[200px]">
            Default
          </Button>
        </div>
      </div>

      <div className="hidden sm:block sm:absolute sm:bottom-[26px] sm:left-[28px] lg:bottom-[58px] lg:left-[34px]">
        <svg width="10" height="39" viewBox="0 0 10 39" fill="none">
          <path
            d="M5 0L5 38.0977M5 38.0977L9.18359 34.0977M5 38.0977L1 34.0977"
            stroke="white"
          />
        </svg>
      </div>

      <SunriseBackground />
    </div>
  );
}
