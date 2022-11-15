import { ProvidePlugin } from 'webpack';
import { merge } from 'webpack-merge';

module.exports = async (config: any) => {
  const mergedConfig = merge(config, {
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
    module: {
      rules: [
        {
          test: /\.svg/,
          type: 'asset/resource',
        },
      ],
    },
  });

  return mergedConfig;
};
