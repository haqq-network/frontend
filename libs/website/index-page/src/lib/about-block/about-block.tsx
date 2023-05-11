import { Heading, Text } from '@haqq/website/ui-kit';

export function AboutBlock() {
  return (
    <div
      className="border-haqq-border mx-[16px] flex flex-col border-l px-[16px] pb-[60px] sm:ml-[63px] sm:mr-0 sm:h-[450px] sm:flex-row sm:pb-0 sm:pl-0 sm:pr-0 lg:ml-[79px] lg:h-[500px]"
      id="about"
    >
      <div className="pt-[60px] sm:w-[284px] sm:pl-[20px] sm:pt-[60px] lg:w-[595px] lg:pl-[32px] lg:pt-[140px]">
        <Heading level={2}>About HAQQ</Heading>
      </div>
      <div className="border-haqq-border flex-1 pt-[16px] sm:border-l sm:pl-[22px] sm:pr-[64px] sm:pt-[60px] lg:pl-[32px] lg:pr-[80px] lg:pt-[150px]">
        <Text className="mb-[36px] block">
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
