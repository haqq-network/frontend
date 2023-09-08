import type { Metadata } from 'next';
import { PrivacyPolicyPage } from '@haqq/haqq-website/privacy-policy-page';
import { DEPLOY_URL } from '../../../constants';
import { getPrivacyPolicy } from '../../../utils/get-privacy-policy';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: '',
  openGraph: {
    title: 'HAQQ | Privacy Policy',
    description: '',
    locale: 'en-US',
    type: 'website',
    images: [{ url: `${new URL(DEPLOY_URL)}opengraph-image.png` }],
    url: `${new URL(DEPLOY_URL)}blog`,
  },
  twitter: {
    title: 'HAQQ | Privacy Policy',
    description: '',
    card: 'summary_large_image',
  },
};

export default async function Page() {
  const privacyPolicy = await getPrivacyPolicy();

  return <PrivacyPolicyPage privacyPolicy={privacyPolicy} />;
}
