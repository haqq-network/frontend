import { storyblokInit, apiPlugin } from '@storyblok/js';
import {
  REVALIDATE_TIME,
  STORYBLOK_ACCESS_TOKEN,
  VERCEL_ENV,
} from '../constants';
import { cache } from 'react';
import {
  Partner,
  PartnerStatus,
  PartnerType,
} from '@haqq/haqq-website/ecosystem-page';

export const revalidate = REVALIDATE_TIME;

interface PartnerData {
  _uid: string;
  name: string;
  logo: {
    filename: string;
  };
  link: string;
  description: string;
  type: string;
  status: string;
}

interface StoryblokData {
  story: {
    content: {
      body: Array<{
        columns: Array<PartnerData>;
      }>;
    };
  };
}

function mapStoryblockDataToPartners(data: StoryblokData): Array<Partner> {
  return data.story.content.body[0].columns.map((el: PartnerData) => {
    return {
      _uid: el._uid,
      name: el.name,
      logoUrl: el.logo.filename,
      link: el.link,
      description: el.description,
      type: el.type as PartnerType,
      status: el.status as PartnerStatus,
    };
  });
}

export const getPartners = cache(async () => {
  const { storyblokApi } = storyblokInit({
    accessToken: STORYBLOK_ACCESS_TOKEN,
    use: [apiPlugin],
  });

  if (!storyblokApi) {
    throw new Error('Failed to init storyblok');
  }

  const response = await storyblokApi.get('cdn/stories/partners', {
    version: VERCEL_ENV === 'production' ? 'published' : 'draft',
  });

  return mapStoryblockDataToPartners(response.data);
});
