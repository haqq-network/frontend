import { Button, Heading, Text } from '@haqq/website/ui-kit';
import Image from 'next/image';
import Link from 'next/link';
import sunshineBgData from '../../assets/sunshine.svg';

export function ApplyBlock() {
  return (
    <section className="border-t border-t-[#2A2A2B] overflow-hidden relative pt-[68px] pb-[80px] px-[16px] sm:px-[48px] lg:px-[80px]">
      <div className="relative z-10 flex flex-col">
        <Text className="text-haqq-gold"> Grants and Investment Program</Text>
        <Heading className="mt-[8px]">
          Apply now for the Haqq Ecosystem Fund, and let's{' '}
          <br className="hidden md:block" /> make a difference together!
        </Heading>
        <div className="flex flex-col min-[375px]:flex-row gap-[24px] mt-[24px]">
          <Link
            href={'https://forms.gle/cf38bWNKRSEGV2b48'}
            target="_blank"
            rel={'noopener noreferrer'}
          >
            <Button variant={2} className="w-full min-[375px]:w-auto">
              Apply now
            </Button>
          </Link>
          <Link href={'/ecosystem-fund'}>
            <Button className="w-full min-[375px]:w-auto">Learn more</Button>
          </Link>
        </div>
      </div>

      <Image
        src={sunshineBgData.src}
        alt=""
        height={sunshineBgData.height}
        width={sunshineBgData.width}
        className="absolute bottom-0 left-1/2 z-[0] transform -translate-x-1/2"
        priority
      />
    </section>
  );
}
