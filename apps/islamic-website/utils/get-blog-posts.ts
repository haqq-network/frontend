import { cache } from 'react';
import { getIslamicBlogPostsData } from '@haqq/data-access-falconer';
import { REVALIDATE_TIME } from '../constants';

export const revalidate = REVALIDATE_TIME;

export const getIslamicBlogPostsFromFalconer = cache(async () => {
  try {
    const posts = await getIslamicBlogPostsData({
      next: {
        revalidate,
      },
    });

    const tags = [];
    const sortedPosts = posts.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    for (const post of sortedPosts) {
      tags.push(...post.tags);
    }

    return { posts, tags: [...new Set(tags)] };
  } catch (error) {
    console.error(error);
  }

  return { posts: [], tags: [] };
});

export const getBlogPost = cache(async (slug: string) => {
  const posts = await getIslamicBlogPostsData({
    next: {
      revalidate,
    },
  });

  return posts.find((post) => {
    return post.slug === slug;
  });
});
