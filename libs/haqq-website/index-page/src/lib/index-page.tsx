import { AboutBlock } from './about-block/about-block';
import { ContactBlock } from './contact-block/contact-block';
import { DevelopersBlock } from './developers-block/developers-block';
import { HeroBlock } from './hero-block/hero-block';
import { MissionBlock } from './mission-block/mission-block';
import {
  ChainStats,
  StatisticsBlock,
} from './statistics-block/statistics-block';
import { VisionBlock } from './vision-block/vision-block';

export function IndexPage({
  stats,
  turnstileSiteKey,
}: {
  stats?: ChainStats;
  turnstileSiteKey?: string;
}) {
  return (
    <section>
      <HeroBlock />
      <AboutBlock />
      <StatisticsBlock stats={stats} />
      <MissionBlock />
      <VisionBlock />
      <DevelopersBlock />
      {turnstileSiteKey && <ContactBlock turnstileSiteKey={turnstileSiteKey} />}
    </section>
  );
}
