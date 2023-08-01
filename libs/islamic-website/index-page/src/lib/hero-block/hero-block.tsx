import { Button, GradientText, Text } from '@haqq/islamic-ui-kit';

export function HeroBlock() {
  return (
    <div className="mt-[60px] flex flex-col text-white md:mt-[120px] xl:mt-[150px]">
      <div className="text-[28px] font-[600] leading-[32px] md:text-[44px] md:leading-[48px] lg:text-[64px] lg:leading-[70px]">
        Your Gateway <br className="block md:hidden" /> to{' '}
        <br className="hidden md:block" /> Shariah{' '}
        <GradientText>
          Compliant <br className="block xl:hidden" /> Web3
        </GradientText>
      </div>
      <Text size="small" className="mt-[24px] text-white/50 md:mt-[40px]">
        We are on a mission to onboard over 1.8+ billion Muslims into digital
        finance without compromising the values or faith. Islamic Coin is the
        native currency of HAQQ Network, an ethics first blockchain
      </Text>
      <div className="mt-[36px] md:mt-[48px]">
        <Button>Get started</Button>
      </div>
    </div>
  );
}
