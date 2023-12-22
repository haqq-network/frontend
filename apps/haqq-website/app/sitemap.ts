import { MetadataRoute } from 'next';
import { getBlogPosts } from '../utils/get-blog-posts';

const staticUrls = [
  {
    url: 'https://haqq.network/',
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 1,
  },
  {
    url: 'https://haqq.network/audits',
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 1,
  },
  {
    url: 'https://haqq.network/blog',
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 1,
  },
  {
    url: 'https://haqq.network/brand-assets',
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 1,
  },
  {
    url: 'https://haqq.network/ecosystem',
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1,
  },
  {
    url: 'https://haqq.network/ecosystem-fund',
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 1,
  },
  {
    url: 'https://haqq.network/events/scan',
    lastModified: new Date(),
    changeFrequency: 'never',
    priority: 0.1,
  },
  {
    url: 'https://haqq.network/events/sign-up',
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.1,
  },
  {
    url: 'https://haqq.network/privacy-policy',
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.1,
  },
  {
    url: 'https://haqq.network/validators',
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 1,
  },
  {
    url: 'https://haqq.network/wp',
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 1,
  },
  {
    url: 'https://haqq.network/wallet',
    lastModified: new Date(),
    changeFrequency: 'never',
    priority: 0.1,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { posts } = await getBlogPosts();

  const slugs = posts.map((post) => {
    return post.slug;
  });

  const pages = [
    ...staticUrls.map((el) => {
      return {
        url: el.url,
        lastModified: el.lastModified,
        changeFrequency:
          el.changeFrequency as MetadataRoute.Sitemap[0]['changeFrequency'],
        priority: el.priority,
      };
    }),
    ...slugs.map((el) => {
      return {
        url: `https://haqq.network/blog/${el}`,
        lastModified: new Date(),
        changeFrequency: 'never' as const,
        priority: 0.1,
      };
    }),
  ];

  return pages;
}
