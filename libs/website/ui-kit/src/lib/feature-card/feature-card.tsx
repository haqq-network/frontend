import Image from 'next/image';
import { Heading } from '../heading/heading';
import { Text } from '../text/text';

export interface FeatureCardProps {
  img: {
    src: string;
    width: number;
    height: number;
  };
  feature: string;
  description: string;
}

export function FeatureCard({ img, feature, description }: FeatureCardProps) {
  return (
    <div className="scrollbar-hide snap-center flex flex-col min-w-[283px] sm:min-w-[332px] lg:min-w-[684px] mb-[24px] sm:mb-[57px] lg:mb-[40px]">
      <div className="relative bg-[#262629]">
        <Image src={img.src} alt="img" width={img.width} height={img.height} />
      </div>
      <div className="bg-black text-white flex flex-col lg:flex-row lg:space-x-[72px] text-start p-[24px] sm:pr-[43px] lg:pt-[16px] lg:pl-[16px] lg:pr-[40px] lg:pb-[40px]">
        <Heading level={3} className="mb-[32px] sm:mb-[48px] lg:mb-0">
          {feature}
        </Heading>
        <Text size="small">{description}</Text>
      </div>
    </div>
  );
}

export default FeatureCard;
