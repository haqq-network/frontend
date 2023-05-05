import { Button, Heading, Text } from '@haqq/website/ui-kit';
import Link from 'next/link';

export function ApplyBlock() {
  return (
    <section className="text-center" id="apply">
      <div className="py-[48px] sm:py-[60px] lg:py-[80px] px-[16px] sm:px-[48px] lg:px-[112px] xl:px-[135px]">
        <Text className="text-haqq-bigfoot-feet">
          Grants and Investment Program
        </Text>
        <Heading className="mt-[8px]">
          Apply now for the Haqq Ecosystem Fund, and let's{' '}
          <br className="hidden lg:block" />
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
      </div>
    </section>
  );
}
