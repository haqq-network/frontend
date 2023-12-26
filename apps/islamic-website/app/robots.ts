import { MetadataRoute } from 'next';
import { DEPLOY_URL } from '../constants';
import { SUPPORTED_LOCALES } from '../constants';

export default function robots(): MetadataRoute.Robots {
  const sitemapUrls = SUPPORTED_LOCALES.map((locale) => {
    return `${DEPLOY_URL}/${locale}/sitemap.xml`;
  });

  return {
    rules: {
      userAgent: '*',
      allow: '*',
    },
    sitemap: sitemapUrls,
    host: DEPLOY_URL,
  };
}
