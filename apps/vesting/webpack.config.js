const { ProvidePlugin } = require('webpack');
const { merge } = require('webpack-merge');

module.exports = async (config) => {
  return merge(config, {
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
    node: { global: true },
    module: {
      rules: [
        {
          test: /\.svg/,
          type: 'asset/resource',
        },
      ],
    },
  });
};
