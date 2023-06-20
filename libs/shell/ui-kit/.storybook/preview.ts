import './index.css';

import { Preview } from '@storybook/react';

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
  },
};

export default preview;
