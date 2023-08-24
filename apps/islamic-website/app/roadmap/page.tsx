import { RoadmapPage } from '@haqq/islamic-website/roadmap-page';
import { getRoadmapContent } from '../../utils/get-roadmap-data';
import { Metadata } from 'next';
import { DEPLOY_URL } from '../../constants';

export const metadata: Metadata = {
  title: 'IslamicCoin | Roadmap',
  description:
    'Chart the evolution of Islamic Coin as we pioneer the melding of Islamic traditions with blockchain technology.',
  openGraph: {
    images: [{ url: '/opengraph-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [{ url: '/opengraph-image.png' }],
  },
  metadataBase: new URL(DEPLOY_URL),
};

export default async function Page() {
  const roadmap = await getRoadmapContent();

  return <RoadmapPage roadmap={roadmap} />;
}
