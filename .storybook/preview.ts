import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

export const parameters = {
  actions: { argTypesRegex: '^on.*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
      string: /(ReactNode|ReactText)$/,
    },
  },
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
};
