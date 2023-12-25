import { REVALIDATE_TIME } from '../constants';
import { cache } from 'react';
import { getHaqqBlogPosts } from '@haqq/data-access-falconer';

export const revalidate = REVALIDATE_TIME;

export const getHaqqBlogPostsFromFalconer = cache(async () => {
  try {
    const posts = await getHaqqBlogPosts({
      next: {
        revalidate,
      },
    });

    const tags = [];

    for (const post of posts) {
      tags.push(...post.tags);
    }

    return { posts, tags: [...new Set(tags)] };
  } catch (error) {
    console.error(error);
  }

  return { posts: [], tags: [] };
});

export const getBlogPost = cache(async (slug: string) => {
  const posts = await getHaqqBlogPosts({
    next: {
      revalidate,
    },
  });

  return posts.find((post) => {
    return post.slug === slug;
  });
});
