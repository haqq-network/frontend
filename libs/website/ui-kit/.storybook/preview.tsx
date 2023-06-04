import { Preview } from '@storybook/react';
import './index.css';
import * as NextImage from 'next/image';
import type { ImageProps } from 'next/image';

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
  },
};

export default preview;

const OriginalNextImage = NextImage.default;

Object.defineProperty(NextImage, 'default', {
  configurable: true,
  value: (props: ImageProps) => {
    return <OriginalNextImage {...props} unoptimized />;
  },
});
