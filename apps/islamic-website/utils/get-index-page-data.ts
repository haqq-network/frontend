import { cache } from 'react';
import { REVALIDATE_TIME } from '../constants';
import { Member, NewsPost } from '@haqq/islamic-website-ui-kit';
import { mapStorybookToNews } from './get-news-data';
import { getIslamicIndexPageData } from '@haqq/data-access-falconer';

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
      const data = await getIslamicIndexPageData(
        {
          next: {
            revalidate,
          },
        },
        locale,
      );
      const mappedNews = mapStorybookToNews(data.news);

      return {
        advisoryMembers: data.members.advisory_members,
        executiveMembers: data.members.executive_members,
        shariahMembers: data.members.shariah_members,
        news: mappedNews,
      };
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
