import { render, waitFor } from '@testing-library/react';
import { SelectChainModal } from './select-chain-modal';
import { renderWithUserEvents } from '../../../tests/render-with-user-events';

const mockChains = [
  { id: 1, name: 'Chain 1' },
  { id: 2, name: 'Chain 2' },
  { id: 3, name: 'Chain 3' },
];

describe('SelectChainModal', () => {
  it('should render a modal with a list of chains to select from', async () => {
    const onClose = jest.fn();
    const onChainSelect = jest.fn();

    const { getByText, getByRole } = render(
      <SelectChainModal
        isOpen
        onClose={onClose}
        chains={mockChains}
        onChainSelect={onChainSelect}
      />,
    );

    await waitFor(() => {
      expect(getByText('Select network')).toBeInTheDocument();
      expect(
        getByText(
          'Your current action cannot be performed as the application is connected to an unsupported network. Please select one of the supported networks from the list below to proceed.',
        ),
      ).toBeInTheDocument();
      expect(getByText('Chain 1')).toBeInTheDocument();
      expect(getByText('Chain 2')).toBeInTheDocument();
      expect(getByText('Chain 3')).toBeInTheDocument();
      expect(getByRole('button', { name: 'Close modal' })).toBeInTheDocument();
    });
  });

  it('should call the onChainSelect function with the corresponding chain id when a chain button is clicked', async () => {
    const onClose = jest.fn();
    const onChainSelect = jest.fn();

    const { getByText, user } = renderWithUserEvents(
      <SelectChainModal
        isOpen
        onClose={onClose}
        chains={mockChains}
        onChainSelect={onChainSelect}
      />,
    );

    const chainButton = await waitFor(() => {
      return getByText('Chain 2');
    });
    await user.click(chainButton);

    expect(onChainSelect).toHaveBeenCalledWith(2);
    expect(onChainSelect).toHaveBeenCalledTimes(1);
  });

  it('should call the onClose function when the close button is clicked', async () => {
    const onClose = jest.fn();
    const onChainSelect = jest.fn();

    const { getByRole, user } = renderWithUserEvents(
      <SelectChainModal
        isOpen
        onClose={onClose}
        chains={mockChains}
        onChainSelect={onChainSelect}
      />,
    );

    const modalCloseButton = await waitFor(() => {
      return getByRole('button', { name: 'Close modal' });
    });
    await user.click(modalCloseButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
