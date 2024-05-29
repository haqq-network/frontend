import { Meta, StoryObj } from '@storybook/react';
import { SearchInput as SearchInputComponent } from './search-input';

const meta: Meta<typeof SearchInputComponent> = {
  component: SearchInputComponent,
  title: 'shell/ui-kit',
};

export default meta;
type Story = StoryObj<typeof SearchInputComponent>;

export const SearchInput: Story = {
  args: {
    value: '',
  },
};
