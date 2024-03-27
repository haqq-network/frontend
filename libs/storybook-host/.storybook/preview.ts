import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { Preview } from '@storybook/react';
import './index.css';

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
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
    nextjs: {
      appDirectory: true,
    },
  },
};

export default preview;
