// Helper for combining webpack config objects
const { merge } = require('webpack-merge');
const { ProvidePlugin } = require('webpack');

module.exports = (config, context) => {
  return merge(config, {
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
      },
    },
  });
};
