import { MetadataRoute } from 'next';
import { academyModules } from '@haqq/islamic-website/academy-page';
import { SITE_URL } from '../constants';
import { SUPPORTED_LOCALES } from '../constants';

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lessonUrls: SitemapUrl[] = [];

  for (const academyModule of academyModules) {
    const moduleLessonsLength = academyModule.isAvailable
      ? academyModule.moduleLessons.length
      : 0;

    for (
      let lessonCount = 1;
      lessonCount <= moduleLessonsLength;
      lessonCount++
    ) {
      for (const locale of SUPPORTED_LOCALES) {
        if (academyModule.isAvailable) {
          const url = new URL(
            `/${locale}${staticRoutes[1]}/lessons/${moduleLessonsLength}/${lessonCount}`,
            SITE_URL,
          ).toString();
          lessonUrls.push({
            url,
            lastModified: academyModule.availableLessonsDate.toISOString(),
          });
        }
      }
    }
  }

  const staticUrls = SUPPORTED_LOCALES.flatMap((locale) => {
    return staticRoutes.map((route) => {
      return {
        url: new URL(`/${locale}${route}`, SITE_URL).toString(),
        lastModified: new Date().toISOString(),
      };
    });
  });

  const sitemapUrls = [...staticUrls, ...lessonUrls].sort((a, b) => {
    return a.url.localeCompare(b.url);
  });

  return sitemapUrls;
}
