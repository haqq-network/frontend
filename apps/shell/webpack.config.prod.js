const { withModuleFederation } = require('@nrwl/react/module-federation');
const baseConfig = require('./module-federation.config');
const { ProvidePlugin } = require('webpack');
const { merge } = require('webpack-merge');

/**
 * @type {import('@nrwl/devkit').ModuleFederationConfig}
 **/
const prodConfig = {
  ...baseConfig,
  remotes: [
    ['staking', '//haqq-staking.vercel.app'],
    ['governance', '//haqq-governance.vercel.app'],
  ],
};

module.exports = async (config) => {
  const federatedModules = await withModuleFederation(prodConfig);

  return merge(federatedModules(config), {
    plugins: [
      new ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
    ],
    resolve: {
      fallback: {
        buffer: false,
        crypto: false,
        events: false,
        path: false,
        stream: false,
        string_decoder: false,
      },
    },
  });
};
