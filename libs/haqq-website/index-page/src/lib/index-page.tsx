import dynamic from 'next/dynamic';
import { AboutBlock } from './about-block/about-block';
import { DevelopersBlock } from './developers-block/developers-block';
import { HeroBlock } from './hero-block/hero-block';
import { MissionBlock } from './mission-block/mission-block';
import {
  ChainStats,
  StatisticsBlock,
} from './statistics-block/statistics-block';
import { VisionBlock } from './vision-block/vision-block';

const ContactBlock = dynamic(
  async () => {
    const { ContactBlock } = await import('./contact-block/contact-block');
    return { default: ContactBlock };
  },
  { ssr: false },
);

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
