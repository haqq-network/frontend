import { Tabs as TabsComponent } from './tabs';
import { Meta, StoryObj } from '@storybook/react';
import { ActiveTab, NonActiveTab } from './tab.stories';

const meta: Meta<typeof TabsComponent> = {
  component: TabsComponent,
  title: 'website/ui-kit/tabs',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof TabsComponent>;

export const Tabs: Story = {
  render: () => (
    <TabsComponent>
      <ActiveTab {...ActiveTab.args} />
      <NonActiveTab {...NonActiveTab.args} />
    </TabsComponent>
  ),
};
