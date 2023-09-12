import * as NextImage from 'next/image';
import type { ImageProps } from 'next/image';

const OriginalNextImage = NextImage.default;

Object.defineProperty(NextImage, 'default', {
  configurable: true,
  value: (props: ImageProps) => {
    return <OriginalNextImage {...props} unoptimized />;
  },
});
