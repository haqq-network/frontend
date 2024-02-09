import { Meta, StoryObj } from '@storybook/react';
import { TopValidatorsWarningModal as TopValidatorsWarningModalComponent } from './top-validators-warning-modal';

const meta: Meta<typeof TopValidatorsWarningModalComponent> = {
  component: TopValidatorsWarningModalComponent,
  title: 'shell/ui-kit/TopValidatorsWarningModal',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof TopValidatorsWarningModalComponent>;

export const Default: Story = {
  args: {
    isOpen: true,
  },
};