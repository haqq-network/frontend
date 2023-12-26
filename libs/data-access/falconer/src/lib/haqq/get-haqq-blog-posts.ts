import { FALCONER_ENDPOINT } from '../../constants';
import { FalconerRequestInit } from '../../types';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  content?: string;
  description?: string;
  image: { src: string; width: number; height: number } | null;
  isFeatured?: boolean;
  tags: string[];
}

export async function getHaqqBlogPostsData(
  options: Partial<FalconerRequestInit>,
) {
  const requestUrl = new URL('/haqq/blog_posts', FALCONER_ENDPOINT);
  const response = await fetch(requestUrl, {
    method: 'GET',
    ...options,
  });

  if (!response.ok) {
    throw new Error('Blog posts fetch failed');
  }

  const responseJson = await response.json();

  return responseJson.posts as BlogPost[];
}