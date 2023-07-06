import { Preview } from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import './next-image-patch';
import './index.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on.*' },
    backgrounds: {
      default: 'haqq-black',
      values: [
        {
          name: 'haqq-black',
          value: '#0d0d0e',
        },
        {
          name: 'white',
          value: '#fff',
        },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
  },
};

export default preview;
