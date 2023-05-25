import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  stories: [
    '../../../libs/website/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../../../libs/shell/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../../../libs/staking/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../../../libs/governance/**/*.stories.@(js|jsx|ts|tsx|mdx)',
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
};

export default config;
