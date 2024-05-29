const { join } = require('path');
const { NxReactWebpackPlugin } = require('@nx/react/webpack-plugin');
const { NxWebpackPlugin } = require('@nx/webpack');
const { ProvidePlugin, DefinePlugin } = require('webpack');

/** @type {import('webpack').Config} */
module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/vesting'),
  },
  devServer: {
    port: 4200,
    historyApiFallback: true,
  },
  plugins: [
    new NxWebpackPlugin({
      tsConfig: './tsconfig.app.json',
      compiler: 'swc',
      main: './src/main.tsx',
      index: './src/index.html',
      baseHref: '/',
      assets: ['./src/favicon.ico', './src/assets'],
      styles: ['./src/index.css'],
      outputHashing: process.env['NODE_ENV'] === 'production' ? 'all' : 'none',
      optimization: process.env['NODE_ENV'] === 'production',
      // sourceMap: process.env['NODE_ENV'] === 'development',
    }),
    new NxReactWebpackPlugin({
      // Uncomment this line if you don't want to use SVGR
      // See: https://react-svgr.com/
      // svgr: false
    }),
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
      'process.env.INDEXER_ENDPOINT': JSON.stringify(
        process.env['INDEXER_ENDPOINT'],
      ),
    }),
  ],
  node: { global: true },
  resolve: {
    fallback: {
      assert: false,
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
  module: {
    rules: [
      {
        test: /\.svg/,
        type: 'asset/resource',
      },
    ],
  },
};
