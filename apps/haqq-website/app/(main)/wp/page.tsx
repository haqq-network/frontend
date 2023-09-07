import type { Metadata } from 'next';
import { getWhitepaper } from '../../../utils/get-whitepaper';
import { WhitepaperPage } from '@haqq/haqq-website/whitepaper-page';

export const metadata: Metadata = {
  title: 'Whitepaper',
  description:
    'Ethics-first network that welcomes sustainability-centered developers, validators and open source contributors as well as Muslim innovators in sustainable Finance',
};

export default async function Page() {
  const whitepaper = await getWhitepaper();

  return <WhitepaperPage whitepaper={whitepaper} />;
}
