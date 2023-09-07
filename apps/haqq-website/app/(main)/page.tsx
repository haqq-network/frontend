import type { Metadata } from 'next';
import { IndexPage } from '@haqq/haqq-website/index-page';
import { getChainStats } from '../..//utils/get-chain-stats';

export const metadata: Metadata = {
  title: 'Home of ethical web3',
  description:
    'Ethics-first network that welcomes sustainability-centered developers, validators and open source contributors as well as Muslim innovators in sustainable Finance',
};

export default async function Page() {
  const stats = await getChainStats();

  return <IndexPage stats={stats} />;
}
