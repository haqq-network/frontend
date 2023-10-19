const { composePlugins, withNx } = require('@nx/webpack');
const { withReact } = require('@nx/react');
const { ProvidePlugin, DefinePlugin } = require('webpack');
const { merge } = require('webpack-merge');

// Nx plugins for webpack.
module.exports = composePlugins(
  withNx(),
  withReact(),
  (config, { options, context }) => {
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
    });
  },
);
