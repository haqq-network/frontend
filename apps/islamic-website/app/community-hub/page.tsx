import { DEPLOY_URL } from '../../constants';
import type { Metadata } from 'next';

const title = 'IslamicCoin | Community hub';

export const metadata: Metadata = {
  title,

  openGraph: {
    title,

    images: [{ url: '/opengraph-image.png' }],
    locale: 'en-US',
    url: `${new URL(DEPLOY_URL)}build`,
    type: 'website',
  },
};

export { CommunityHubPage as default } from '@haqq/islamic-website/community-hub-page';
