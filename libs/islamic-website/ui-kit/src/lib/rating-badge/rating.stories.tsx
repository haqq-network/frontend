import type { Meta, StoryObj } from '@storybook/react';
import { RatingBadge as RatingBadgeComponent } from './rating-badge';

const meta: Meta<typeof RatingBadgeComponent> = {
  component: RatingBadgeComponent,
  title: 'islamic-website/ui-kit/RatingBadge',
};

export default meta;
type Story = StoryObj<typeof RatingBadgeComponent>;

export const SmallRatingBadge: Story = {
  args: {
    rating: 1.3,
  },
};

export const BigRatingBadge: Story = {
  args: {
    rating: 4.8,
  },
};
