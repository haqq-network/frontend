//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');
const withNextIntl = require('next-intl/plugin');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  compress: true,
  swcMinify: true,
  reactStrictMode: true,
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'a.storyblok.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'placekitten.com',
      },
    ],
  },
  rewrites: async () => {
    return [
      {
        source: '/api/ingest/:path*',
        destination: 'https://eu.posthog.com/:path*',
      },
    ];
  },
};

const plugins = [withNx, withNextIntl('./i18n.ts')];

module.exports = composePlugins(...plugins)(nextConfig);
