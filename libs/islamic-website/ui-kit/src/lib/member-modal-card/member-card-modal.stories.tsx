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
    title: 'Alexander Jonathan Sebastian-Carrington',
    description:
      'Alexander Jonathan Sebastian-Carrington is a renowned historian and linguist, known for his extensive research in ancient Mediterranean civilizations. With a career spanning over three decades, Alexander has contributed significantly to the understanding of early human societies through his innovative approach to deciphering ancient scripts. His work has not only enriched academic discourse but also made ancient history accessible to a wider audience, earning him numerous awards and accolades in the field of historical studies.',
    image: 'https://picsum.photos/400/300',
  },
};
