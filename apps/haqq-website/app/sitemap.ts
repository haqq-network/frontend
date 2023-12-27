import { MetadataRoute } from 'next';
import { SITE_URL } from '../constants';
import { getHaqqBlogPostsFromFalconer } from '../utils/get-blog-posts';

const staticRoutes = [
  '/',
  '/audits',
  '/blog',
  '/brand-assets',
  '/ecosystem',
  '/ecosystem-fund',
  '/events/scan',
  '/events/sign-up',
  '/privacy-policy',
  '/validators',
  '/wp',
  '/wallet',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { posts } = await getHaqqBlogPostsFromFalconer();

  const blogPosts = posts.map((post) => {
    return {
      url: new URL(`blog/${post.slug}`, SITE_URL).toString(),
      lastModified: new Date(post.date)?.toISOString(),
    };
  });

  const staticUrls = staticRoutes.map((route) => {
    return {
      url: new URL(route, SITE_URL).toString(),
      lastModified: new Date().toISOString(),
    };
  });

  return [...staticUrls, ...blogPosts];
}
