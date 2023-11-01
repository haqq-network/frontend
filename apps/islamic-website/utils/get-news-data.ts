import { NewsPost } from '@haqq/islamic-website-ui-kit';
import { REVALIDATE_TIME } from '../constants';
import { cache } from 'react';
import { FalconerNewsPost, getNewsData } from '@haqq/data-access-falconer';

export const revalidate = REVALIDATE_TIME;

export function mapStorybookToNews(data: FalconerNewsPost[]): NewsPost[] {
  return data.map((post) => {
    return {
      image: post.image,
      title: post.title,
      description: post.description,
      date: new Date(post.date),
      source: post.source,
      type: post.content_type,
      url: post.url,
    };
  });
}

export const getNewsPageContentFromFalconer = cache(async (limit?: number) => {
  try {
    const data = await getNewsData(
      {
        next: {
          revalidate,
        },
      },
      limit,
    );

    return mapStorybookToNews(data) ?? [];
  } catch (error) {
    console.error(error);
  }
});
