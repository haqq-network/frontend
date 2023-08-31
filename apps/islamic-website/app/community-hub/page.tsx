import { DEPLOY_URL } from '../../constants';
import type { Metadata } from 'next';

const title = 'IslamicCoin | Community hub';
const description =
  'Join a vibrant community committed to ethical finance. Engage in conversations, share knowledge, and foster connections within the Islamic Coin network.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    images: [{ url: '/opengraph-image.png' }],
    locale: 'en-US',
    url: `${new URL(DEPLOY_URL)}build`,
    type: 'website',
  },
};

export { CommunityHubPage as default } from '@haqq/islamic-website/community-hub-page';
