import { act, render } from '@testing-library/react';
import { renderWithUserEvents } from '../../../tests/render-with-user-events';
import { Button } from './button';

describe('<Button />', () => {
  it('should render a button element with the provided children and default props', () => {
    const children = 'Test Button';
    const { getByRole } = render(
      <Button className="test-class">{children}</Button>,
    );
    const buttonElement = getByRole('button');

    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveTextContent(children);
    expect(buttonElement).not.toBeDisabled();
    expect(buttonElement).toHaveAttribute('type', 'button');
    expect(buttonElement).toHaveClass('test-class');
  });

  it('should render SpinnerLoader when the button is in loading state', async () => {
    const { getByRole, queryByText } = renderWithUserEvents(
      <Button isLoading>Loading button</Button>,
    );
    const spinnerElement = getByRole('status');

    expect(spinnerElement).toBeInTheDocument();
    expect(queryByText('Loading...')).toBeInTheDocument();
    expect(queryByText('Loading button')).not.toBeInTheDocument();
  });

  it('should call the onClick function when the button is clicked', async () => {
    const onClick = jest.fn();
    const { getByRole, user } = renderWithUserEvents(
      <Button onClick={onClick}>Test button</Button>,
    );
    const buttonElement = getByRole('button');

    await act(async () => {
      await user.click(buttonElement);
    });

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should render a button element with no children', () => {
    const { getByRole } = render(<Button />);
    const buttonElement = getByRole('button');

    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toBeEmptyDOMElement();
  });

  it('should not call the onClick function when the button is clicked and the onClick prop is not provided', async () => {
    const onClick = jest.fn();
    const { getByRole, user } = renderWithUserEvents(
      <Button>Test button</Button>,
    );
    const buttonElement = getByRole('button');

    await act(async () => {
      await user.click(buttonElement);
    });

    expect(onClick).not.toHaveBeenCalled();
  });

  it('should not call the onClick function when the button is disabled', async () => {
    const onClick = jest.fn();
    const { getByRole, user } = renderWithUserEvents(
      <Button onClick={onClick} disabled type="submit">
        Disabled button
      </Button>,
    );
    const buttonElement = getByRole('button');

    await act(async () => {
      await user.click(buttonElement);
    });

    expect(buttonElement).toBeDisabled();
    expect(buttonElement).toHaveAttribute('type', 'submit');
    expect(onClick).not.toHaveBeenCalled();
  });

  it('should not call the onClick function when the button is in loading state', async () => {
    const onClick = jest.fn();
    const { getByRole, user } = renderWithUserEvents(
      <Button onClick={onClick} isLoading type="reset">
        Loading button
      </Button>,
    );
    const buttonElement = getByRole('button');

    await act(async () => {
      await user.click(buttonElement);
    });

    expect(buttonElement).not.toBeDisabled();
    expect(buttonElement).toHaveAttribute('type', 'reset');
    expect(onClick).not.toHaveBeenCalled();
  });
});
