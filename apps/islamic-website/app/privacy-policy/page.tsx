import type { Metadata } from 'next';
import { PrivacyPolicyPage } from '@haqq/islamic-website/privacy-policy-page';
import { DEPLOY_URL } from '../../constants';
import { getPrivacyPolicyContent } from '../../utils/get-privacy-policy-content';

const title = 'IslamicCoin | Privacy Policy';
const description = '';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    images: [{ url: '/opengraph-image.png' }],
    locale: 'en-US',
    url: `${new URL('/whitepaper', DEPLOY_URL).toString()}`,
    type: 'website',
  },
};

export default async function Page() {
  const privacyPolicy = await getPrivacyPolicyContent();

  return <PrivacyPolicyPage privacyPolicy={privacyPolicy} />;
}
