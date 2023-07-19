import type { Meta } from '@storybook/react';
import { Button } from './button';

const Story: Meta<typeof Button> = {
  component: Button,
  title: 'islamic-website/ui-kit/Button',
};
export default Story;

export const Primary = {
  args: {
    children: 'Button',
  },
};
