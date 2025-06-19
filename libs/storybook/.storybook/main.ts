import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: [
    '../src/**/*.@(stories.@(mdx|js|jsx|ts|tsx))',
    '../../**/*.@(stories.@(mdx|js|jsx|ts|tsx))',
  ],

  addons: [
    '@nx/react/plugins/storybook',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-storysource',
  ],

  framework: {
    name: '@storybook/nextjs',
    options: {},
  },

  docs: {},

  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
};

export default config;
