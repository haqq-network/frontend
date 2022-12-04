import { HeroBlock } from '../hero-block/hero-block';
import { AboutBlock } from '../about-block/about-block';
import { ContactBlock } from '../contact-block/contact-block';
import { PartnershipBlock } from '../partnership-block/partnership-block';
import { MissionBlock } from '../mission-block/mission-block';

export function WebsiteIndexPage() {
  return (
    <section>
      <HeroBlock />
      <AboutBlock />
      <MissionBlock />
      <PartnershipBlock />
      <ContactBlock />
    </section>
  );
}
