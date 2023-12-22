import { MetadataRoute } from 'next';
import { DEPLOY_URL } from '../constants';
import { getBlogPosts } from '../utils/get-blog-posts';

const staticUrls = [
  '',
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
      url: `${DEPLOY_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date)?.toUTCString(),
    };
  });

  const staticRoutes = staticUrls.map((el) => {
    return {
      url: `${DEPLOY_URL}${el}`,
      lastModified: new Date().toISOString().split('T')[0],
    };
  });

  return [...staticRoutes, ...blogPosts];
}
