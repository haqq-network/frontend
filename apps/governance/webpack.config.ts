import { withModuleFederation } from '@nrwl/react/module-federation';
import baseConfig from './module-federation.config';
import { ProvidePlugin } from 'webpack';
import { merge } from 'webpack-merge';

/**
 * @type {import('@nrwl/react/module-federation').ModuleFederationConfig}
 **/
const defaultConfig = {
  ...baseConfig,
};

module.exports = async (config: any) => {
  const federatedModules = await withModuleFederation(defaultConfig);

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
        assert: false,
      },
    },
  });
};
