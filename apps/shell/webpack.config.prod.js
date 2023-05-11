const { withModuleFederation } = require('@nx/react/module-federation');
const { composePlugins, withNx } = require('@nx/webpack');
const { withReact } = require('@nx/react');
const { ProvidePlugin } = require('webpack');
const { merge } = require('webpack-merge');
const baseConfig = require('./module-federation.config');

/**
 * @type {import('@nrwl/devkit').ModuleFederationConfig}
 **/
const prodConfig = {
  ...baseConfig,
  // remotes: [
  //   ['staking', '//haqq-staking.vercel.app'],
  //   ['governance', '//haqq-governance.vercel.app'],
  // ],
  remotes: [
    [
      'staking',
      '//staking-app-git-feat-new-shell-components-haqq-network.vercel.app',
    ],
    [
      'governance',
      '//governance-app-git-feat-new-shell-components-haqq-network.vercel.app',
    ],
  ],
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
