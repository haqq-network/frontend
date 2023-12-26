import { MetadataRoute } from 'next';
import { VERCEL_ENV } from '../constants';
import { headers } from 'next/headers';

export default function robots(): MetadataRoute.Robots {
  const host = headers().get('x-forwarded-host') || headers().get('host');
  const protocol = VERCEL_ENV === 'production' ? 'https' : 'http';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${protocol}://${host}/sitemap.xml`,
    host: `${protocol}://${host}`,
  };
}
