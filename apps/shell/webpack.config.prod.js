const { withModuleFederation } = require('@nx/react/module-federation');
const { composePlugins, withNx } = require('@nx/webpack');
const { withReact } = require('@nx/react');
const { ProvidePlugin } = require('webpack');
const { merge } = require('webpack-merge');
const baseConfig = require('./module-federation.config');

const moduleFederationRemote =
  process.env['VERCEL_ENV'] === 'production'
    ? [
        ['staking', '//staking.haqq.network'],
        ['governance', '//governance.haqq.network'],
      ]
    : [
        ['staking', '//staking.haqq.sh'],
        ['governance', '//governance.haqq.sh'],
      ];

/**
 * @type {import('@nrwl/devkit').ModuleFederationConfig}
 **/
const prodConfig = {
  ...baseConfig,
  remotes: moduleFederationRemote,
};

// Nx plugins for webpack.
module.exports = composePlugins(
  withNx(),
  withReact(),
  async (config, { options, context }) => {
    const federatedModules = await withModuleFederation(prodConfig);

    return merge(federatedModules(config), {
      plugins: [
        new ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
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
