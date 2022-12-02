import { Heading, Text } from '@haqq/website/ui-kit';

export function AboutBlock() {
  return (
    <div
      className="px-[16px] mx-[16px] sm:pl-0 sm:ml-[63px] lg:ml-[79px] border-l border-haqq-border flex flex-col sm:flex-row sm:h-[450px] lg:h-[500px] pb-[60px] sm:pb-0"
      id="about"
    >
      <div className="pt-[60px] sm:pt-[60px] lg:pt-[140px] sm:pl-[20px] lg:pl-[32px] sm:w-[284px] lg:w-[595px]">
        <Heading level={2}>About HAQQ</Heading>
      </div>
      <div className="pt-[16px] sm:pt-[60px] lg:pt-[150px] sm:pl-[22px] lg:pl-[32px] sm:border-l border-haqq-border flex-1 sm:pr-[64px] lg:pr-[80px]">
        <Text className="block mb-[36px]">
          HAQQ brings together the most reputable actors of Ethical finance in
          order to promote community-driven decentralized technologies
          worldwide.
        </Text>
        <Text className="block">
          HAQQ is an EVM-equivalent chain, based on Cosmos SDK. The technology
          behind HAQQ makes it possible for any smart contract created on other
          EVM chains to be deployed onto the new network without any changes
          needed.
        </Text>
      </div>
    </div>
  );
}
