import type { Metadata } from 'next';
import { DEPLOY_URL } from '../../../constants';
import { islamicOpenGraphImages } from '../../shared-metadata';
import { TeamPage } from '@haqq/islamic-website/team-page';
import { getMembersContent } from '../../../utils/get-members-data';

const title = 'Team';
const description =
  'Get to know the dedicated individuals propelling Islamic Coin towards harmonizing Islamic finance with blockchain.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} | IslamicCoin`,
    description,
    images: islamicOpenGraphImages,
    url: new URL('/team', DEPLOY_URL).toString(),
  },
};

interface PageProps {
  params: { locale: string };
}

export default async function Page(props: PageProps) {
  const {
    params: { locale },
  } = props;
  console.log({ locale }, 'TEAM PAGE SERVER');
  const { teamMembers } = await getMembersContent({ locale });

  return <TeamPage teamMembers={teamMembers} />;
}
