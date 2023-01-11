import Image from 'next/image';
import { Heading } from '../heading/heading';
import { Text } from '../text/text';

export interface FeatureCardProps {
  img: string;
  title: string;
  description: string;
}

export function FeatureCard({ img, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-col w-[283px] sm:w-[332px] lg:w-[684px] mb-[24px] sm:mb-[57px] lg:mb-[40px]">
      <div className="relative bg-[#262629] h-[140px] w-[283px] sm:h-[155px] sm:w-[332px] lg:h-[200px] lg:w-[684px]">
        <Image src={img} alt="img" fill />
      </div>
      <div className="bg-black text-white flex flex-col lg:flex-row lg:space-x-[72px] text-start p-[24px] sm:pr-[43px] lg:pt-[16px] lg:pl-[16px] lg:pr-[40px] lg:pb-[40px]">
        <Heading level={3} className="mb-[32px] sm:mb-[48px] lg:mb-0">
          {title}
        </Heading>
        <Text size="small">{description}</Text>
      </div>
    </div>
  );
}

export default FeatureCard;
