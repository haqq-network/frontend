import { storyblokInit, apiPlugin } from '@storyblok/js';
import { Member } from '@haqq/islamic-ui-kit';
import { STORYBLOK_ACCESS_TOKEN, VERCEL_ENV } from '../constants';

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

export async function getMembersContent() {
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
