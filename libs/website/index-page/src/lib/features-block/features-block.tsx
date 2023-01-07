import {
  FeatureCard,
  Heading,
  PaginationButton,
  Text,
} from '@haqq/website/ui-kit';

import firstFeatureData from '../../assets/images/features/1.svg';
import secondFeatureData from '../../assets/images/features/2.svg';
import { useRef, useState } from 'react';

const FeaturesData = [
  {
    img: {
      src: firstFeatureData,
      width: firstFeatureData.width,
      height: firstFeatureData.height,
    },
    description:
      'Solidity developers can build smart contracts with familiar, time-proven stack and migrate any smart contracts, deployed on other EVM networks like Ethereum, on HAQQ without rewriting a single line of code',
    feature: 'EVM-compatible',
    id: 1,
  },
  {
    img: {
      src: secondFeatureData,
      width: secondFeatureData.width,
      height: secondFeatureData.height,
    },
    description:
      'Solidity developers can build smart contracts with familiar, time-proven stack and migrate any smart contracts, deployed on other EVM networks like Ethereum, on HAQQ without rewriting a single line of code',
    feature: 'EVM-compatible',
    id: 2,
  },
  {
    img: {
      src: secondFeatureData,
      width: secondFeatureData.width,
      height: secondFeatureData.height,
    },
    description:
      'Solidity developers can build smart contracts with familiar, time-proven stack and migrate any smart contracts, deployed on other EVM networks like Ethereum, on HAQQ without rewriting a single line of code',
    feature: 'EVM-compatible',
    id: 3,
  },
  {
    img: {
      src: secondFeatureData,
      width: secondFeatureData.width,
      height: secondFeatureData.height,
    },
    description:
      'Solidity developers can build smart contracts with familiar, time-proven stack and migrate any smart contracts, deployed on other EVM networks like Ethereum, on HAQQ without rewriting a single line of code',
    feature: 'EVM-compatible',
    id: 4,
  },
];

export function FeaturesBlock() {
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isActive, setIsActive] = useState<number>(0);

  const handleClick = (index: number) => {
    if (isActive === index) {
      return;
    }
    setIsActive(index);
    const items = itemRefs?.current[index];
    const container = containerRef?.current;
    const left = items.offsetLeft - container.offsetLeft;
    containerRef.current?.scrollTo({ left: left, behavior: 'smooth' });
  };

  return (
    <div className="bg-white flex flex-col">
      <div
        className="text-black pl-[16px] pr-[32px] ml-[16px] sm:pl-0 sm:ml-[63px] sm:mr-0 sm:pr-0 lg:ml-[79px] border-l border-[#0D0D0E/24] h-[702px] sm:h-[850px] lg:h-[863px] pb-[60px] sm:pb-0"
        id="features"
      >
        <div className="flex flex-col">
          <div className="flex flex-col sm:flex-row">
            <div className="pt-[60px] sm:pt-[96px] lg:pt-[121px] sm:pl-[20px] lg:pl-[32px] sm:w-[241px] lg:w-[289px] sm:space-x-[40px] lg:space-x-[305px]">
              <Heading level={2}>Features for ethical builders</Heading>
            </div>
            <div className="pt-[16px] sm:pt-[100px] lg:pt-[132px] sm:pl-0 lg:pl-[32px] sm:pr-[64px] lg:pr-[199px] sm:border-l border-haqq-border flex-1 ">
              <Text className="block mb-[32px] sm:mb-[40px]">
                HAQQ is a fast Proof-of-stake network built with the Tendering
                consensus engine, with fast finality. It means that transaction
                effects become irreversible and can't be altered immediately
                after block inclusion.
              </Text>
            </div>
          </div>
          <div className="sm:ml-[120px] lg:ml-[211px]">
            <div
              className="flex flex-row items-center overflow-x-hidden snap-mandatory snap-x space-x-[12px] sm:space-x-[20px] lg:space-x-[28px]"
              ref={(el: HTMLDivElement) => (containerRef.current = el)}
            >
              {FeaturesData.map((el, index) => (
                <div
                  key={el.id}
                  ref={(el: HTMLDivElement) => (itemRefs.current[index] = el)}
                >
                  <FeatureCard
                    description={el.description}
                    feature={el.feature}
                    img={el.img}
                  />
                </div>
              ))}
            </div>
            <div className="flex sm:ml-[-100px] lg:ml-[-178px]">
              {FeaturesData.map((el, index) => (
                <PaginationButton
                  key={el.id}
                  page={index + 1}
                  onClick={() => handleClick(index)}
                  active={isActive === index}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
