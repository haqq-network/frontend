import { DEPLOY_URL } from '../../../constants';
import type { Metadata } from 'next';
import { islamicOpenGraphImages } from '../../shared-metadata';

const title = 'Team';
const description =
  'Get to know the dedicated individuals propelling Islamic Coin towards harmonizing Islamic finance with blockchain.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} | IslamicCoin`,
    description,
    images: islamicOpenGraphImages,
    url: new URL('/team', DEPLOY_URL).toString(),
  },
};

export { TeamPage as default } from '@haqq/islamic-website/team-page';
