import type { Metadata } from 'next';
import { PrivacyPolicyPage } from '@haqq/islamic-website/privacy-policy-page';
import { DEPLOY_URL } from '../../../constants';
import { getPrivacyPolicyContent } from '../../../utils/get-privacy-policy-content';
import { islamicOpenGraphImages } from '../../shared-metadata';

const title = 'Privacy Policy';
const description = '';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} | IslamicCoin`,
    description,
    images: islamicOpenGraphImages,
    url: new URL('/privacy-policy', DEPLOY_URL).toString(),
  },
};

export default async function Page() {
  const privacyPolicy = await getPrivacyPolicyContent();

  return <PrivacyPolicyPage privacyPolicy={privacyPolicy} />;
}
