import type { Metadata } from 'next';
import { DEPLOY_URL, SOCIAL_LINKS } from '../../../constants';
import { islamicOpenGraphImages } from '../../shared-metadata';
import { CommunityHubPage } from '@haqq/islamic-website/community-hub-page';

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

export default async function Page() {
  return <CommunityHubPage socialLinks={SOCIAL_LINKS} />;
}
