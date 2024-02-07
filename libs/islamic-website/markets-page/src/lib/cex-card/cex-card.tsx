import clsx from 'clsx';
import Image, { StaticImageData } from 'next/image';
import { GradientText } from '@haqq/islamic-website-ui-kit';

interface CEXCardProps {
  name: string;
  logo: string | StaticImageData;
}

export function CEXCard({ name, logo }: CEXCardProps) {
  return (
    <div
      className={clsx(
        'flex flex-col rounded-[20px] backdrop-blur-[6px]',
        'bg-[#181E25B2] transition-colors duration-200 ease-in-out hover:bg-[#181E25]',
        'p-[20px] md:p-[36px]',
        'gap-[12px] md:flex-row md:items-center md:gap-[32px]',
      )}
    >
      <div className="h-[40px] w-[40px] overflow-hidden md:h-[80px] md:w-[80px]">
        <Image
          src={logo}
          alt={`${name} logo`}
          className="object-cover"
          width={80}
          height={80}
        />
      </div>

      <div>
        <div className="ltr:font-vcr rtl:font-handjet text-[18px] font-[400] uppercase leading-[26px] md:text-[24px] md:leading-[34px]">
          {name}
        </div>

        <div className="font-alexandria mt-[2px] text-[13px] font-[400] leading-[20px] md:mt-[4px] md:text-[18px] md:leading-[24px]">
          <GradientText>Go to Exchange</GradientText>
        </div>
      </div>
    </div>
  );
}
