import { Button, Heading, Text } from '@haqq/website/ui-kit';
import Link from 'next/link';
import bgImgData from '../../assets/lines.svg';

export function ApplyBlock() {
  return (
    <section
      className="relative flex flex-col items-center text-center font-light h-[362px] sm:h-[380px] lg:h-[446px] pt-[48px] px-[16px] sm:pt-[60px] sm:px-[48px] bg-center bg-cover bg-no-repeat mb-[-46px] 2xl:mb-[-26px]"
      id="apply"
      style={{
        backgroundImage: `url(${bgImgData.src})`,
      }}
    >
      <Text className="text-haqq-bigfoot-feet">
        Grants and Investment Program
      </Text>
      <Heading className="mt-[8px]">
        Apply now for the Haqq Ecosystem Fund, and let's{' '}
        <br className="hidden absolute top-0 lg:block" />
        make a difference together!
      </Heading>
      <Link
        href={'https://forms.gle/cf38bWNKRSEGV2b48'}
        target="_blank"
        rel={'noopener noreferrer'}
      >
        <Button variant={2} className="uppercase mt-[24px]">
          Apply now
        </Button>
      </Link>
    </section>
  );
}
