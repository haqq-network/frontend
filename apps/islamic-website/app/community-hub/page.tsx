import type { Metadata } from 'next';

const title = 'IslamicCoin | Community hub';

export const metadata: Metadata = {
  title,
  openGraph: {
    title,
    images: [{ url: '/opengraph-image.png' }],
  },
};

export { CommunityHubPage as default } from '@haqq/islamic-website/community-hub-page';
