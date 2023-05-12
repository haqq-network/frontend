import './index.css';

import { Preview } from '@storybook/react';

const preview: Preview = {
  parameters: {
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
  },
};

export default preview;
