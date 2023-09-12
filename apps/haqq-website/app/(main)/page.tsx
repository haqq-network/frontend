import type { Metadata } from 'next';
import { IndexPage } from '@haqq/haqq-website/index-page';
import { getChainStats } from '../..//utils/get-chain-stats';
import { DEPLOY_URL, TURNSTILE_SITEKEY } from '../../constants';
import { haqqOpenGraphImages } from '../../shared-metadata';

const title = 'Home of ethical web3';
const description =
  'Ethics-first network that welcomes sustainability-centered developers, validators and open source contributors as well as Muslim innovators in sustainable Finance';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} | HAQQ`,
    description,
    url: new URL(DEPLOY_URL).toString(),
    images: haqqOpenGraphImages,
  },
};

export default async function Page() {
  const stats = await getChainStats();

  return <IndexPage stats={stats} turnstileSiteKey={TURNSTILE_SITEKEY} />;
}
