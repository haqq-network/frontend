import { act, render } from '@testing-library/react';
import { renderWithUserEvents } from '../../../tests/render-with-user-events';
import { Checkbox } from './checkbox';

describe('<Checkbox />', () => {
  it('should render Checkbox component with default props', () => {
    const { getByRole } = render(<Checkbox onChange={jest.fn()} />);

    const checkboxElement = getByRole('checkbox');

    expect(checkboxElement).toBeInTheDocument();
    expect(checkboxElement).not.toBeChecked();
    expect(checkboxElement).not.toBeDisabled();
  });

  it('should render Checkbox component with custom props', () => {
    const onChangeMock = jest.fn();
    const { getByRole, getByText, container } = render(
      <Checkbox
        id="custom-checkbox"
        value={true}
        disabled={true}
        containerClassName="custom-container-checkbox"
        inputClassName="custom-input-checkbox"
        onChange={onChangeMock}
      >
        Ahoy!
      </Checkbox>,
    );

    const checkboxElement = getByRole('checkbox');

    expect(checkboxElement).toBeInTheDocument();
    expect(checkboxElement).toHaveAttribute('id', 'custom-checkbox');
    expect(checkboxElement).toBeVisible();
    expect(checkboxElement).toBeChecked();
    expect(checkboxElement).toBeDisabled();
    expect(checkboxElement).toHaveClass('custom-input-checkbox');

    const labelElement = getByText('Ahoy!');

    expect(labelElement).toBeInTheDocument();

    expect(container.firstChild).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('custom-container-checkbox');
  });

  it('should call onChange function when checkbox is clicked', async () => {
    const onChangeMock = jest.fn();
    const { getByRole, user } = renderWithUserEvents(
      <Checkbox onChange={onChangeMock} />,
    );

    const checkboxElement = getByRole('checkbox');

    await act(async () => {
      await user.click(checkboxElement);
    });

    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock).toHaveBeenCalledWith(true, expect.anything());
  });

  it('should toggle checkbox when label is clicked', async () => {
    const onChangeMock = jest.fn();
    const { getByText, user } = renderWithUserEvents(
      <Checkbox onChange={onChangeMock}>Click me!</Checkbox>,
    );

    const labelElement = getByText('Click me!');

    await act(async () => {
      await user.click(labelElement);
    });

    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock).toHaveBeenCalledWith(true, expect.anything());

    await act(async () => {
      await user.click(labelElement);
    });

    expect(onChangeMock).toHaveBeenCalledTimes(2);
    expect(onChangeMock).toHaveBeenCalledWith(false, expect.anything());
  });

  it('should display children prop in the label', () => {
    const { getByText } = render(
      <Checkbox onChange={jest.fn()}>Ahoy!</Checkbox>,
    );

    const labelElement = getByText('Ahoy!');

    expect(labelElement).toBeInTheDocument();
  });

  it('should render disabled Checkbox component', async () => {
    const onChangeMock = jest.fn();
    const { getByRole, user } = renderWithUserEvents(
      <Checkbox onChange={jest.fn()} disabled={true} />,
    );

    const checkboxElement = getByRole('checkbox');

    expect(checkboxElement).toBeInTheDocument();
    expect(checkboxElement).toBeDisabled();

    await act(async () => {
      await user.click(checkboxElement);
    });

    expect(onChangeMock).not.toHaveBeenCalled();
  });
});
