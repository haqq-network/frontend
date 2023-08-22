import { Member, ShariahPage } from '@haqq/islamic-website/shariah-page';
import { storyblokInit, apiPlugin } from '@storyblok/js';
import { DEPLOY_URL } from '../../contansts';
import { Metadata } from 'next';

const STORYBLOK_ACCESS_TOKEN = process.env['STORYBLOK_ACCESS_TOKEN'];
const VERCEL_ENV = process.env['VERCEL_ENV'];

interface StoryblokMember {
  title: string;
  fullDescription: string;
  url: string;
  image: {
    filename: string;
  };
}

function mapStoryblokToMembers(data: StoryblokMember[]): Member[] {
  return data.map((member) => {
    return {
      image: member.image.filename,
      title: member.title,
      description: member.fullDescription,
      url: member.url,
    };
  });
}

async function getMembersContent() {
  const { storyblokApi } = storyblokInit({
    accessToken: STORYBLOK_ACCESS_TOKEN,
    use: [apiPlugin],
  });

  if (!storyblokApi) {
    throw new Error('Failed to init storyblok');
  }

  const response = await storyblokApi.get('cdn/stories/boardmembers', {
    version: VERCEL_ENV === 'production' ? 'published' : 'draft',
  });

  const executiveMembers = mapStoryblokToMembers(
    response.data.story.content.body[0].columns,
  );

  const shariahMembers = mapStoryblokToMembers(
    response.data.story.content.body[1].columns,
  );

  const advisoryMembers = mapStoryblokToMembers(
    response.data.story.content.body[2].columns,
  );

  return {
    executiveMembers,
    shariahMembers,
    advisoryMembers,
  };
}

export const metadata: Metadata = {
  title: 'IslamicCoin | Shariah',
  description: '',
  openGraph: {
    images: [{ url: '/opengraph-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [{ url: '/opengraph-image.png' }],
  },
  metadataBase: new URL(DEPLOY_URL),
};

export default async function Page() {
  const shariaMembers = (await getMembersContent()).shariahMembers;
  const advisoryMembers = (await getMembersContent()).advisoryMembers;
  const executiveMembers = (await getMembersContent()).executiveMembers;

  return (
    <ShariahPage
      shariahMembers={shariaMembers}
      advisoryMembers={advisoryMembers}
      executiveMembers={executiveMembers}
    />
  );
}
