import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DEPLOY_URL } from '../../../constants';
import { islamicOpenGraphImages } from '../../shared-metadata';

const title = 'Partnerships';
const description =
  "Collaborate with a pioneer in Shariah-compliant blockchain solutions. Let's redefine ethical finance together.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} | IslamicCoin`,
    description,
    images: islamicOpenGraphImages,
    url: new URL('/partnerships', DEPLOY_URL).toString(),
  },
};

export default async function Page() {
  notFound();
}
