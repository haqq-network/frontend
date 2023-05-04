import { Heading, Text, DownloadButton } from '@haqq/website/ui-kit';

export function TitleBlock() {
  return (
    <section className="flex flex-col pt-[48px] pl-[16px] sm:pt-[68px] sm:pl-[48px] lg:pl-[80px] ">
      <Heading level={1}>Brand Assets</Heading>
      <Text className="mt-[8px]" size="large">
        Here you can find more Islamic Coin and Haqq logos
      </Text>
      <DownloadButton
        variant={2}
        link="../../assets/kek.txt"
        withIcon
        className="w-[260px] mt-[24px] sm:mt-[32px]"
      >
        Download Full Pack
      </DownloadButton>
    </section>
  );
}
