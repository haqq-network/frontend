import type { StorybookConfig } from '@storybook/nextjs';
import { ProvidePlugin } from 'webpack';
import { merge } from 'webpack-merge';

const config: StorybookConfig = {
  stories: [
    '../src/**/*.@(stories.@(mdx|js|jsx|ts|tsx))',
    '../../../libs/**/*.@(stories.@(mdx|js|jsx|ts|tsx))',
  ],

  addons: [
    '@storybook/addon-essentials',
    '@nx/react/plugins/storybook',
    '@storybook/addon-storysource',
  ],

  framework: {
    name: '@storybook/nextjs',
    options: {},
  },

  webpackFinal: async (config) => {
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
          http: false,
          zlib: false,
          https: false,
          url: false,
        },
      },
    });
  },

  docs: {
    autodocs: true,
  },
};

export default config;
