//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPlugins = require('next-compose-plugins');
const { withNx } = require('@nrwl/next/plugins/with-nx');
const createWithMDX = require('@next/mdx');

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  async redirects() {
    return [
      {
        source: '/privacy-policy',
        destination: 'https://www.boredgen.net/wallet/privacy-policy',
        permanent: true,
      },
      {
        source: '/terms-and-conditions',
        destination: 'https://www.boredgen.net/wallet/terms-and-conditions',
        permanent: true,
      },
    ];
  },
};

const mdxConfig = {
  extension: /\.mdx?$/,
  options: {
    // If you use remark-gfm, you'll need to use next.config.mjs
    // as the package is ESM only
    // https://github.com/remarkjs/remark-gfm#install
    remarkPlugins: [],
    rehypePlugins: [],
    // If you use `MDXProvider`, uncomment the following line.
    // providerImportSource: "@mdx-js/react",
  },
};
const withMDX = createWithMDX(mdxConfig);

module.exports = withPlugins([
  [
    withMDX,
    {
      // Append the default value with md extensions
      pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
    },
  ],
  [withNx, nextConfig],
]);
