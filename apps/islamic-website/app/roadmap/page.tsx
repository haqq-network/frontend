import { RoadmapPage } from '@haqq/islamic-website/roadmap-page';
import { getRoadmapContent } from '../../utils/get-roadmap-data';
import { Metadata } from 'next';
import { DEPLOY_URL } from '../../contansts';

export const metadata: Metadata = {
  title: 'IslamicCoin | Roadmap',
  description: '',
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
