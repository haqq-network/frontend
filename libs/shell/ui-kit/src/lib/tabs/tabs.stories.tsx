import { useState } from 'react';
import { Tabs as TabsComponent, Tab } from './tabs';

export default {
  title: 'shell/ui-kit',
};

export const Tabs = () => {
  const [tab, setTab] = useState('my-delegations');

  return (
    <TabsComponent>
      <Tab
        isActive={tab === 'my-delegations'}
        onClick={() => {
          setTab('my-delegations');
        }}
      >
        My delegations
      </Tab>
      <Tab
        isActive={tab === 'other-validators'}
        onClick={() => {
          setTab('other-validators');
        }}
      >
        Other validators
      </Tab>
    </TabsComponent>
  );
};
