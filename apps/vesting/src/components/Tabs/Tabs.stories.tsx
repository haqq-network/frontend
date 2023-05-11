import { ComponentStory } from '@storybook/react';
import { Tabs as TabsComponent, Tab } from './Tabs';

export default {
  title: 'ui-kit/Tabs',
  parameters: {
    layout: 'centered',
  },
};

export const Tabs: ComponentStory<typeof TabsComponent> = () => {
  return (
    <div className="mx-auto max-w-xl">
      <Tabs>
        <Tab isActive>Stats</Tab>
        <Tab>Withdraw</Tab>
        <Tab>Transfer</Tab>
      </Tabs>
    </div>
  );
};
