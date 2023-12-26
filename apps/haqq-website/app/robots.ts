import { MetadataRoute } from 'next';
import { DEPLOY_URL } from '../constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${DEPLOY_URL}/sitemap.xml`,
    host: DEPLOY_URL,
  };
}
