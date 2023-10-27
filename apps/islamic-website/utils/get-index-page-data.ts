import { cache } from 'react';
import { FALCONER_ENDPOINT, REVALIDATE_TIME } from '../constants';
import { Member, NewsPost } from '@haqq/islamic-website-ui-kit';
import { mapStorybookToNews } from './get-news-data';

export const revalidate = REVALIDATE_TIME;

export const getHomePageContent = cache(
  async (
    locale: string,
  ): Promise<{
    advisoryMembers: Member[];
    executiveMembers: Member[];
    shariahMembers: Member[];
    news: NewsPost[];
  }> => {
    try {
      const response = await fetch(`${FALCONER_ENDPOINT}/islamic/home`, {
        method: 'POST',
        body: JSON.stringify({ locale }),
        next: {
          revalidate,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const mappedNews = mapStorybookToNews(data.news);

        return {
          advisoryMembers: data.members.advisory_members,
          executiveMembers: data.members.executive_members,
          shariahMembers: data.members.shariah_members,
          news: mappedNews,
        };
      } else {
        console.log('Response was not ok.', response);
      }
    } catch (error) {
      console.error(error);
    }
    return {
      advisoryMembers: [],
      executiveMembers: [],
      shariahMembers: [],
      news: [],
    };
  },
);
