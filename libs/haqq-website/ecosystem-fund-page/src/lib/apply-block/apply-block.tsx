import { Button, Heading, Text } from '@haqq/haqq-website-ui-kit';
import Link from 'next/link';
import bgImgData from '../../assets/lines.svg';

export function ApplyBlock() {
  return (
    <section
      className="relative mb-[-46px] flex h-[362px] flex-col items-center bg-cover bg-center bg-no-repeat px-[16px] pt-[48px] text-center font-light sm:h-[380px] sm:px-[48px] sm:pt-[60px] lg:h-[446px] 2xl:mb-[-26px]"
      id="apply"
      style={{
        backgroundImage: `url(${bgImgData.src})`,
      }}
    >
      <Text className="text-haqq-gold">Grants and Investment Program</Text>
      <Heading className="mt-[8px]">
        Apply now for the HAQQ Ecosystem Fund, and let's{' '}
        <br className="absolute top-0 hidden lg:block" />
        make a difference together!
      </Heading>
      <Link
        href={'https://forms.gle/cf38bWNKRSEGV2b48'}
        target="_blank"
        rel={'noopener noreferrer'}
      >
        <div className="mt-[24px]">
          <Button variant={2}>Apply now</Button>
        </div>
      </Link>
    </section>
  );
}
