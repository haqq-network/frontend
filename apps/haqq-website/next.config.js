//@ts-check
// eslint-disable-next-line @typescript-eslint/no-var-requires
const createWithMDX = require('@next/mdx');
const { composePlugins, withNx } = require('@nx/next');

const withMDX = createWithMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
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
        hostname: 'a.storyblok.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
    ],
  },
  async redirects() {
    return [
      // {
      //   source: '/privacy-policy',
      //   destination: 'https://www.boredgen.net/wallet/privacy-policy',
      //   permanent: true,
      // },
      {
        source: '/terms-and-conditions',
        destination: 'https://www.boredgen.net/wallet/terms-and-conditions',
        permanent: true,
      },
    ];
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

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
  withMDX,
];

module.exports = composePlugins(...plugins)(nextConfig);
