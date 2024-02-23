const { withReact } = require('@nx/react');
const { composePlugins, withNx } = require('@nx/webpack');
const { ProvidePlugin, DefinePlugin } = require('webpack');
const { merge } = require('webpack-merge');

// Nx plugins for webpack.
module.exports = composePlugins(
  withNx({
    nx: {
      svgr: false,
    },
  }),
  withReact(),
  async (config) => {
    return merge(config, {
      plugins: [
        new ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        }),
        new DefinePlugin({
          'process.env.GIT_COMMIT_SHA': JSON.stringify(
            process.env['GIT_COMMIT_SHA'] ??
              process.env['NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA'] ??
              process.env['VERCEL_GIT_COMMIT_SHA'] ??
              'dev',
          ),
          'process.env.FAUNADB_SECRET': JSON.stringify(
            process.env.FAUNADB_SECRET,
          ),
          'process.env.FAUNADB_URL': JSON.stringify(process.env.FAUNADB_URL),
        }),
      ],
      node: { global: true },
      resolve: {
        fallback: {
          buffer: false,
          crypto: false,
          events: false,
          path: false,
          stream: false,
          string_decoder: false,
          http: false,
          zlib: false,
          https: false,
          url: false,
        },
      },
      ignoreWarnings: [
        { module: /next/ },
        { module: /cosmjs-types/ },
        { module: /ethereumjs-util/ },
        { module: /@evmos/ },
        { module: /@walletconnect/ },
        { module: /@cosmjs/ },
        { module: /@haqqjs/ },
      ],
    });
  },
);
