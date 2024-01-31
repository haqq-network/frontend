import type { Metadata } from 'next';
import { TeamPage } from '@haqq/islamic-website/team-page';
import { DEPLOY_URL } from '../../../constants';
import { getMembersContentFromFalconer } from '../../../utils/get-members';
import { islamicOpenGraphImages } from '../../shared-metadata';

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
  const { teamMembers, founderMembers } =
    await getMembersContentFromFalconer(locale);

  return <TeamPage team={teamMembers} founders={founderMembers} />;
}
