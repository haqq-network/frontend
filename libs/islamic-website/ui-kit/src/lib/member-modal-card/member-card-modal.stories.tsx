import type { Meta, StoryObj } from '@storybook/react';
import { MemberModalCard as MemberModalCardComponent } from './member-modal-card';

const meta: Meta<typeof MemberModalCardComponent> = {
  component: MemberModalCardComponent,
  title: 'islamic-website/ui-kit',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof MemberModalCardComponent>;

export const MemberModalCard: Story = {
  args: {
    title: 'Sheikh Dr. Hazza bin Sultan bin Zayed Al Nahyan',
    description:
      "His Highness Sheikh Dr. Hazza Bin Sultan Bin Zayed Al Nahyan is Chairman of the Board of Directors of the Management of H. H. Sheikh Sultan Bin Zayed Al Nahyan. He also chairs the Board of Directors of holding companies concerned with Real Estate and Economic Development. Sheikh Dr. Hazza completed his Ph.D. in natural resources, Economic Development and Security in the United Arab Emirates from Bangor University in the United Kingdom in 2009. This is after completing his master's thesis in the philosophy of modern societies and global transformation from the University of Cambridge, United Kingdom, in 2007.",
    image: 'https://picsum.photos/200/300',
  },
};
