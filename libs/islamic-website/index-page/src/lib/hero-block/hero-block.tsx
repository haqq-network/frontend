import { Button, Container, GradientText, Text } from '@haqq/islamic-ui-kit';

export function HeroBlock() {
  return (
    <Container>
      <div className="flex flex-col pt-[60px] text-white md:pt-[120px] xl:pt-[150px]">
        <h1 className="text-[46px] font-[600] leading-[52px] md:text-[60px] md:leading-none lg:text-[80px]">
          Your Gateway <br className="block md:hidden" /> to{' '}
          <br className="hidden md:block" /> Shariah{' '}
          <GradientText>
            Compliant <br className="block xl:hidden" /> Web3
          </GradientText>
        </h1>
        <div className="mt-[24px] md:max-w-xl">
          <Text size="small" className="text-white/50 md:mt-[40px]">
            We are on a mission to onboard over 1.8+ billion Muslims into
            digital finance without compromising the values or faith. Islamic
            Coin is the native currency of HAQQ Network, an ethics first
            blockchain
          </Text>
          <div className="mt-[36px] md:mt-[48px]">
            <Button>Get started</Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
