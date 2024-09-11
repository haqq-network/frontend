import { Meta, StoryObj } from '@storybook/react';
import { fn, userEvent, expect, screen } from '@storybook/test';
import { UndelegateModal as UndelegateModalComponent } from './undelegate-modal';

const meta: Meta<typeof UndelegateModalComponent> = {
  component: UndelegateModalComponent,
  title: 'shell/ui-kit/modals/plug-and-play',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof UndelegateModalComponent>;

export const UndelegateModal: Story = {
  args: {
    isOpen: true,
    symbol: 'islm',
    delegation: 1000.1234,
    balance: 100.654321,
    unboundingTime: 10,
    undelegateAmount: 100,
    fee: 0.0061,
    isFeePending: false,
    memo: '',
    onChange: fn(),
    onClose: fn(),
    onSubmit: fn(),
    onMemoChange: fn(),
  },
  play: async ({ args }) => {
    // Find and click the 'max' button
    const maxButton = await screen.findByText('Max');
    await userEvent.click(maxButton);

    // Check if onChange was called with the correct value
    expect(args.onChange).toHaveBeenCalledWith(1000.1234);

    // Check if the input value is rounded correctly
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('100');

    // Check if the balance is formatted correctly
    const balanceElement = screen.getByText('100.654 ISLM');
    expect(balanceElement).toBeInTheDocument();

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
  },
};
