import { Container, Text } from '@haqq/islamic-ui-kit';

export function HeroBlock() {
  return (
    <Container className="mt-[32px] flex flex-col text-white md:mt-[52px] lg:mt-[68px]">
      <div className="text-[46px] font-[600] leading-[52px] md:text-[60px] md:leading-none lg:text-[80px]">
        Sharia-Compliance
      </div>
      <Text size="small" className="mt-[18px] text-white/50 md:mt-[28px]">
        Islamic Coin harmonizes tradition with modernity, uniting Sharia
        compliance with blockchain technology to forge a pioneering platform in
        Islamic finance. Upheld by Halal Investing principles and safeguarded by
        our innovative Sharia Oracle, Islamic Coin stands as a testament to the
        thriving of traditional Islamic values in the digital world.
      </Text>
    </Container>
  );
}
