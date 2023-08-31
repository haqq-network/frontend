import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  stories: ['../src/lib/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
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
};

export default config;
