import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { RedelegateModal as RedelegateModalComponent } from './redelegate-modal';

const meta: Meta<typeof RedelegateModalComponent> = {
  component: RedelegateModalComponent,
  title: 'shell/ui-kit/modals/plug-and-play',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof RedelegateModalComponent>;

export const RedelegateModal: Story = {
  args: {
    isOpen: false,
    symbol: 'islm',
    delegation: 1000,
    validatorsOptions: [
      {
        label: 'Paranormal Brothers',
        value: 'haqqvaloper1z349klqa6wu66equz9x67jejsaeauluakymp3e',
      },
      {
        label: 'cryptobtcbuyer',
        value: 'haqqvaloper1r2rq7kjs4zskz50ghre35kqvtx69sc5uw3lltn',
      },
      {
        label: 'Synergy Nodes',
        value: 'haqqvaloper1y4pfpkwpy6myskp7pne256k6smh2rjtaf0wcfl',
      },
      {
        label: 'F5 Nodes',
        value: 'haqqvaloper1x93c3lwves5xagxmx3rkku6scxt9yhwn243sts',
      },
      {
        label: 'P2P.ORG - P2P Validator',
        value: 'haqqvaloper12g3c7a2z9jfwrpyd9vxxt53vup6pfgk5hzl48r',
      },
    ],
    onChange: fn(),
    onClose: fn(),
    onSubmit: fn(),
    onValidatorChange: fn(),
  },
};
