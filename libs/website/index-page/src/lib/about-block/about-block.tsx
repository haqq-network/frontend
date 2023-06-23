import { Heading, Text } from '@haqq/website-ui-kit';

export function AboutBlock() {
  return (
    <div
      className="border-haqq-border mx-[16px] flex flex-col border-l px-[16px] pb-[60px] sm:ml-[63px] sm:mr-0 sm:flex-row sm:pb-0 sm:pl-0 sm:pr-0 lg:ml-[79px]"
      id="about"
    >
      <div className="py-[60px] sm:w-1/3 sm:px-[20px] sm:py-[60px] lg:px-[32px] lg:py-[140px] xl:w-2/5">
        <Heading level={2}>About HAQQ</Heading>
      </div>
      <div className="border-haqq-border flex-1 py-[16px] sm:border-l sm:py-[60px] sm:pl-[22px] sm:pr-[64px] lg:py-[150px] lg:pl-[32px] lg:pr-[80px]">
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
