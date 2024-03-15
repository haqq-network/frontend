import { FALCONER_ENDPOINT } from '../../constants';
import { FalconerRequestInit } from '../../types';
import { BlogPost } from '../haqq/get-haqq-blog-posts';

export async function getIslamicBlogPostsData(
  options: Partial<FalconerRequestInit>,
) {
  const requestUrl = new URL('/islamic/blog', FALCONER_ENDPOINT);
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
