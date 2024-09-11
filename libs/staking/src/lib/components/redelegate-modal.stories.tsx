import { Meta, StoryObj } from '@storybook/react';
import { fn, userEvent, expect, screen } from '@storybook/test';
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
    isOpen: true,
    symbol: 'islm',
    delegation: 1000.1234,
    redelegateAmount: 100,
    balance: 500,
    isDisabled: false,
    fee: 0.0061,
    isFeePending: false,
    memo: '',
    onChange: fn(),
    onClose: fn(),
    onSubmit: fn(),
    onValidatorChange: fn(),
    onMemoChange: fn(),
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
  },
  play: async ({ args }) => {
    // Find and click the 'Max' button
    const maxButton = await screen.findByText('Max');
    await userEvent.click(maxButton);

    // Check if onChange was called with the correct value
    expect(args.onChange).toHaveBeenCalledWith(1000.1234);

    // Check if the input value is rounded correctly
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('100');

    // Check if the delegation is formatted correctly
    const delegationElement = screen.getByText('1,000.123 ISLM');
    expect(delegationElement).toBeInTheDocument();

    // Test input with a non-rounded number
    await userEvent.clear(input);
    await userEvent.type(input, '123.4567');
    await userEvent.tab(); // Trigger blur event

    // Check if the input value is rounded to 3 decimal places
    expect(input).toHaveValue('123.456');

    // Check if onChange was called with the correct rounded value
    expect(args.onChange).toHaveBeenCalledWith(123.456);

    // Check if validator selection works
    const validatorSelect = await screen.findByText('Select new validator');
    await userEvent.click(validatorSelect);
    await userEvent.click(await screen.findByText('Synergy Nodes'));
    expect(args.onValidatorChange).toHaveBeenCalledWith(
      'haqqvaloper1y4pfpkwpy6myskp7pne256k6smh2rjtaf0wcfl',
    );

    // Check if the fee is displayed
    const feeElement = screen.getByText('0.0061 ISLM');
    expect(feeElement).toBeInTheDocument();

    // Check if the confirm redelegation button is active
    const confirmButton = screen.getByText('Confirm redelegation');
    expect(confirmButton).not.toBeDisabled();
  },
};
