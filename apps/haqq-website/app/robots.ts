import { MetadataRoute } from 'next';
import { SITE_URL } from '../constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        disallow: '/events/*',
      },
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: new URL('/sitemap.xml', SITE_URL).toString(),
    host: new URL(SITE_URL).toString(),
  };
}
