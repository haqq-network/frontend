import type { StorybookConfig } from '@storybook/react-webpack5';
import { ProvidePlugin } from 'webpack';
import { merge } from 'webpack-merge';

const config: StorybookConfig = {
  stories: [
    '../src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../../../libs/website/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../../../libs/shell/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../../../libs/staking/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../../../libs/governance/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../../../libs/islamic-website/**/*.stories.@(js|jsx|ts|tsx|mdx)',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@nx/react/plugins/storybook',
    'storybook-addon-react-router-v6',
    '@storybook/addon-storysource',
  ],
  framework: {
    name: '@storybook/react-webpack5',
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
};

export default config;
