import Image from 'next/image';
import { Heading } from '../heading/heading';
import { Text } from '../text/text';

export interface EcosystemCardProps {
  backgroundImg?: string;
  logo?: string;
  title?: string;
  description: string;
  imgClassName?: string;
  width?: number;
}

export function EcosystemCard({
  backgroundImg,
  logo,
  title,
  description,
}: EcosystemCardProps) {
  return (
    <div className="relative bg-black flex text-white p-[16px] h-[260px] w-[253px] sm:w-[403px] lg:w-[566px]">
      {backgroundImg && (
        <Image
          src={backgroundImg}
          alt="bg-image"
          className="absolute object-cover bg-center"
          fill
          priority
        />
      )}
      <div className="flex flex-col justify-between z-[1]">
        <div className="flex flex-col sm:flex-row sm:space-x-[12px]">
          <div className="relative w-[26px] h-[24px] sm:w-[26px] sm:h-[24px] mb-[12px]">
            {logo && <Image src={logo} alt="img" fill />}
          </div>
          <Heading level={3}>{title}</Heading>
        </div>
        <div className="">
          <Text size="small">{description}</Text>
        </div>
      </div>
    </div>
  );
}
