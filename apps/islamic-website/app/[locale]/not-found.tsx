import type { Metadata } from 'next';
import { DEPLOY_URL } from '../../constants';
import { islamicOpenGraphImages } from '../shared-metadata';
import { NotFound } from '@haqq/islamic-website/not-found-page';

const title = 'Not Found';

export const metadata: Metadata = {
  title,
  openGraph: {
    title: `${title} | IslamicCoin`,
    url: new URL(DEPLOY_URL).toString(),
    images: islamicOpenGraphImages,
  },
};

export default async function Page() {
  return <NotFound />;
}
