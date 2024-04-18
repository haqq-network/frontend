import type { Meta, StoryObj } from '@storybook/react';
import { RatingBadge as RatingBadgeComponent } from './rating-badge';

const meta: Meta<typeof RatingBadgeComponent> = {
  component: RatingBadgeComponent,
  title: 'islamic-website/ui-kit',
};

export default meta;
type Story = StoryObj<typeof RatingBadgeComponent>;

export const RatingBadge: Story = {
  args: {
    rating: 0.887123123798,
  },
};
