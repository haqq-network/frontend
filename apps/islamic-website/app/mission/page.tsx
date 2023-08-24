import type { Metadata } from 'next';

const title = 'IslamicCoin | Mission';
const description =
  'On a mission to onboard the global Muslim community to digital finance without compromising Islamic values.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    images: [{ url: '/opengraph-image.png' }],
  },
};

export { MissionPage as default } from '@haqq/islamic-website/mission-page';
