import { MetadataRoute } from 'next';
import { SITE_URL } from '../constants';
import { getBlogPosts } from '../utils/get-blog-posts';

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
  const { posts } = await getBlogPosts();

  const blogPosts = posts.map((post) => {
    return {
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date)?.toUTCString(),
    };
  });

  const staticUrls = staticRoutes.map((route) => {
    return {
      url: `${SITE_URL}${route}`,
      lastModified: new Date().toISOString().split('T')[0],
    };
  });

  return [...staticUrls, ...blogPosts];
}
