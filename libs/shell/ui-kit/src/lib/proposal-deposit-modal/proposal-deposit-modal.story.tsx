import { Meta } from '@storybook/react';
import { ProposalDepositModal as ProposalDepositModalComponent } from './proposal-deposit-modal';
import { Fragment, useState } from 'react';
import { Button } from '../button/button';

const meta: Meta<typeof ProposalDepositModalComponent> = {
  component: ProposalDepositModalComponent,
  title: 'shell/ui-kit',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const ProposalDepositModal = () => {
  const [opened, setOpened] = useState(true);

  return (
    <Fragment>
      <Button
        onClick={() => {
          setOpened(true);
        }}
      >
        Open Modal
      </Button>
      <ProposalDepositModalComponent
        onClose={() => {
          setOpened(!opened);
        }}
        isOpen={opened}
      />
    </Fragment>
  );
};
