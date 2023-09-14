import type { Metadata } from 'next';
import { PrivacyPolicyPage } from '@haqq/islamic-website/privacy-policy-page';
import { DEPLOY_URL } from '../../../constants';
import { getPrivacyPolicyContent } from '../../../utils/get-privacy-policy-content';
import { islamicOpenGraphImages } from '../../shared-metadata';

const title = 'Privacy Policy';

export const metadata: Metadata = {
  title,
  openGraph: {
    title: `${title} | IslamicCoin`,
    images: islamicOpenGraphImages,
    url: new URL('/privacy-policy', DEPLOY_URL).toString(),
  },
};

export default async function Page() {
  const privacyPolicy = await getPrivacyPolicyContent();

  return <PrivacyPolicyPage privacyPolicy={privacyPolicy} />;
}
