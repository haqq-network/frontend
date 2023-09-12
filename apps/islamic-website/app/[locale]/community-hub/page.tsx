import { DEPLOY_URL } from '../../../constants';
import type { Metadata } from 'next';
import { islamicOpenGraphImages } from '../../shared-metadata';

const title = 'Community hub';
const description =
  'Join a vibrant community committed to ethical finance. Engage in conversations, share knowledge, and foster connections within the Islamic Coin network.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} | IslamicCoin`,
    description,
    images: islamicOpenGraphImages,
    url: new URL('/community-hub', DEPLOY_URL).toString(),
  },
};

export { CommunityHubPage as default } from '@haqq/islamic-website/community-hub-page';
