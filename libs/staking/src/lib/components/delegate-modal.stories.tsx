import { Meta, StoryObj } from '@storybook/react';
import { fn, userEvent, expect, screen } from '@storybook/test';
import { DelegateModal as DelegateModalComponent } from './delegate-modal';

const meta: Meta<typeof DelegateModalComponent> = {
  component: DelegateModalComponent,
  title: 'shell/ui-kit/modals/plug-and-play',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof DelegateModalComponent>;

export const DelegateModal: Story = {
  args: {
    isOpen: true,
    symbol: 'islm',
    balance: 432.1234,
    delegation: 100.654321,
    delegateAmount: 1000.1234,
    isDisabled: false,
    unboundingTime: 21,
    validatorCommission: 10,
    fee: 0.0061,
    isFeePending: false,
    memo: '',
    onChange: fn(),
    onClose: fn(),
    onSubmit: fn(),
    onMemoChange: fn(),
  },
  play: async ({ args }) => {
    // Find and click the 'Max' button
    const maxButton = await screen.findByText('Max');
    await userEvent.click(maxButton);

    // Check if onChange was called with the correct value
    expect(args.onChange).toHaveBeenCalledWith(432);

    // Check if the input value is rounded correctly
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('1,000.123');

    // Check if the balance is formatted correctly
    const balanceElement = screen.getByText('432.123 ISLM');
    expect(balanceElement).toBeInTheDocument();

    // Check if the delegation is formatted correctly
    const delegationElement = screen.getByText('100.654 ISLM');
    expect(delegationElement).toBeInTheDocument();

    // Test input with a non-rounded number
    await userEvent.clear(input);
    await userEvent.type(input, '123.4567');
    await userEvent.tab(); // Trigger blur event

    // Check if the input value is rounded to 3 decimal places
    expect(input).toHaveValue('123.456');

    // Check if onChange was called with the correct rounded value
    expect(args.onChange).toHaveBeenCalledWith(123.456);

    // Check if validator commission is displayed
    const commissionElement = screen.getByText('10%');
    expect(commissionElement).toBeInTheDocument();

    // Check if unbounding time is displayed
    const unboundingTimeElement = screen.getByText(/21 day/i);
    expect(unboundingTimeElement).toBeInTheDocument();
  },
};
