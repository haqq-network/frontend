import { AboutBlock } from '../about-block/about-block';
import { ContactBlock } from '../contact-block/contact-block';
import { HeroBlock } from '../hero-block/hero-block';

export function WebsiteIndexPage() {
  return (
    <section>
      <HeroBlock />
      <AboutBlock />
      <ContactBlock />
    </section>
  );
}
