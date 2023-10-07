import { DEPLOY_URL } from '../../../constants';
import type { Metadata } from 'next';
import { islamicOpenGraphImages } from '../../shared-metadata';
import { ScamAlertPage } from '@haqq/islamic-website/alerts-pages';

const title = 'Recruitment Fraud Alert';
const description =
  'Learn how to identify and protect yourself against recruitment scams claiming to be from Islamic Coin. Know the red flags and stay secure in your job search.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} | IslamicCoin`,
    description,
    images: islamicOpenGraphImages,
    url: new URL('/scam-alert', DEPLOY_URL).toString(),
  },
};

interface PageProps {
  params: { locale: string };
}

export default async function Page(props: PageProps) {
  const {
    params: { locale },
  } = props;
  console.log({ locale }, 'SCAM PAGE SERVER');
  return <ScamAlertPage locale={locale} />;
}
