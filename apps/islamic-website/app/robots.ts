import { MetadataRoute } from 'next';
import { SITE_URL } from '../constants';
import { SUPPORTED_LOCALES } from '../constants';

export default function robots(): MetadataRoute.Robots {
  const sitemapUrls = SUPPORTED_LOCALES.map((locale) => {
    return new URL(`/${locale}/sitemap.xml`, SITE_URL).toString();
  });

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: sitemapUrls,
    host: new URL(SITE_URL).toString(),
  };
}
