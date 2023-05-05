import { Button } from '@haqq/website/ui-kit';
import Link from 'next/link';

export function TitleBlock() {
  return (
    <section className="py-[80px] sm:py-[120px] pl-[16px] sm:pl-[48px] lg:pl-[80px]">
      <div className="uppercase font-serif text-[46px] sm:text-[80px] lg:text-[140px] leading-none font-medium">
        Haqq <br /> Ecosys
        <br className="hidden lg:block xl:hidden" />
        tem <br className="block lg:hidden xl:block" /> Fund
      </div>
      <Link href={'#apply'} className="scroll-smooth" scroll={false}>
        <Button variant={2} className="mt-[32px] sm:mt-[48px] lg:mt-[64px]">
          Apply
        </Button>
      </Link>
    </section>
  );
}
