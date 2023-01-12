import Image from 'next/image';
import { Heading } from '../heading/heading';
import { Text } from '../text/text';

export interface FeatureCardProps {
  img: string;
  title: string;
  description: string;
  imgClassName?: string;
}

export function FeatureCard({
  img,
  title,
  description,
  imgClassName,
}: FeatureCardProps) {
  return (
    <div className="flex flex-col">
      <div className="relative bg-[#262629] h-[140px] sm:h-[155px] lg:h-[200px] w-full overflow-hidden">
        <Image src={img} alt="img" fill className={imgClassName} />
      </div>
      <div className="bg-black text-white items-start flex flex-col lg:flex-row min-h-[213px] sm:min-h-[245px] lg:min-h-[174px] p-[24px] sm:pr-[43px] lg:pt-[16px] lg:pr-[40px] lg:pb-[40px] lg:pl-[16px]">
        <div className="lg:w-2/5">
          <Heading
            level={3}
            className="mb-[32px] sm:mb-[48px] lg:mb-0 lg:mr-[72px]"
          >
            {title}
          </Heading>
        </div>
        <div className="flex-1">
          <Text size="small" className="lg:mt-[8px]">
            {description}
          </Text>
        </div>
      </div>
    </div>
  );
}

export default FeatureCard;
