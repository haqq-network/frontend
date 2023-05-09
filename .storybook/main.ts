import type { StorybookConfig } from '@storybook/core-common';
export const rootMain: StorybookConfig = {
  core: {
    builder: 'webpack5',
  },
  features: {
    storyStoreV7: true,
  },
  webpackFinal: async (config, { configType }) => {
    // Make whatever fine-grained changes you need that should apply to all storybook configs
    config.resolve = {
      ...config.resolve,
      fallback: {
        buffer: false,
        crypto: false,
        events: false,
        path: false,
        stream: false,
        string_decoder: false,
      },
    };

    // Return the altered config
    return config;
  },
};
export const framework = {
  name: '@storybook/react-webpack5',
  options: {},
};
export const addons = ['@storybook/addon-mdx-gfm'];
export const docs = {
  autodocs: true,
};
