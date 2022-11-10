import { ComponentStory } from '@storybook/react';
import { PulseLoader as PulseLoaderComponent } from './loaders';

export default {
  title: 'ui-kit/Loaders',
  parameters: {
    layout: 'centered',
  },
};

export const PulseLoader: ComponentStory<typeof PulseLoaderComponent> = () => {
  return <PulseLoaderComponent />;
};
