import { MetadataRoute } from 'next';
import { DEPLOY_URL } from '../../constants';
import { SUPPORTED_LOCALES } from '../../constants';

export interface SitemapUrl {
  url: string;
  lastModified: string;
}

const staticRoutes = [
  '/',
  '/academy',
  '/build',
  '/career',
  '/community-hub',
  '/contact-us',
  '/dubai-residents-disclaimer',
  '/fraud-alert',
  '/mission',
  '/news',
  '/partnerships',
  '/privacy-policy',
  '/roadmap',
  '/scam-alert',
  '/shariah',
  '/team',
  '/validators',
  '/values',
  '/wallet',
  '/whitepaper',
];

const academyModules = [
  { moduleCount: 1, lessonsCount: 2, releaseDate: new Date('2023-12-12') },
  { moduleCount: 2, lessonsCount: 3, releaseDate: new Date('2023-12-19') },
  { moduleCount: 3, lessonsCount: 3, releaseDate: new Date('2023-12-26') },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lessonUrls: SitemapUrl[] = [];

  academyModules.forEach((module) => {
    for (
      let lessonCount = 1;
      lessonCount <= module.lessonsCount;
      lessonCount++
    ) {
      SUPPORTED_LOCALES.forEach((locale) => {
        const url = `${DEPLOY_URL}/${locale}${staticRoutes[1]}/lessons/${module.moduleCount}/${lessonCount}`;
        lessonUrls.push({
          url,
          lastModified: module.releaseDate.toISOString(),
        });
      });
    }
  });

  const staticUrls = SUPPORTED_LOCALES.flatMap((locale) => {
    return staticRoutes.map((route) => {
      return {
        url: `${DEPLOY_URL}/${locale}${route}`,
        lastModified: new Date().toISOString(),
      };
    });
  });

  const sitemapUrls = [...staticUrls, ...lessonUrls].sort((a, b) => {
    return a.url.localeCompare(b.url);
  });

  return sitemapUrls;
}
