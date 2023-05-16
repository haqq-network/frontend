import { WarningMessage as WarningMessageComponent } from './warning-message';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof WarningMessageComponent> = {
  component: WarningMessageComponent,
  title: 'shell/ui-kit',

  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof WarningMessageComponent>;

export const WarningMessage: Story = {
  args: {
    children:
      'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Animi magnam aliquam repudiandae in optio et voluptas explicabo magni? Labore, distinctio quo repellat ipsum amet iure neque natus et fuga rerum.',
  },
};
