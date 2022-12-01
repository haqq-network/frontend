import { AboutBlock } from '../about-block/about-block';
import { HeroBlock } from '../hero-block/hero-block';

export function WebsiteIndexPage() {
  return (
    <section>
      <HeroBlock />
      <AboutBlock />
    </section>
  );
}

export default WebsiteIndexPage;
