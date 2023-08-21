import { IndexPage } from '@haqq/islamic-website/index-page';
import { storyblokInit, apiPlugin } from '@storyblok/js';
import { Member } from '@haqq/islamic-ui-kit';
import { getNewsPageContent } from '../utils/get-news-data';

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

  const advisoryMembers = mapStoryblokToMembers(
    response.data.story.content.body[2].columns,
  );

  return advisoryMembers;
}

export default async function Page() {
  const news = await getNewsPageContent();
  const advisoryMembers = await getMembersContent();
  

  return <IndexPage news={news.slice(0,3)} advisoryMembers={advisoryMembers} />;
}
