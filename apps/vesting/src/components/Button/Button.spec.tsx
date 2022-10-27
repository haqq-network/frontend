import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button, DangerButton } from './Button';

describe('Button', () => {
  it('should render successfully', () => {
    const { baseElement, getByRole } = render(<Button>Hello</Button>);

    expect(baseElement).toBeTruthy();
    expect(baseElement).not.toEqual(null);
    expect(baseElement).toBeVisible();
    expect(baseElement.focus).toBeTruthy();
    expect(getByRole('button')).toBeTruthy();
    expect(getByRole('button')).not.toBeDisabled();
    expect(getByRole('button')).not.toHaveClass('w-full');
    expect(getByRole('button')).toHaveClass('inline-block');
    expect(getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('should render text correctly', () => {
    const { getByText } = render(<Button>Hello</Button>);

    expect(getByText('Hello')).toBeTruthy();
    expect(getByText('Hello')).toHaveTextContent('Hello');
  });

  it('should handle clicks when not disabled', async () => {
    const mockHandler = jest.fn();
    const { getByRole } = render(
      <Button onClick={mockHandler}>Not Disabled</Button>,
    );

    await userEvent.click(getByRole('button'));
    expect(mockHandler).toHaveBeenCalled();
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });

  it('should not handle clicks when disabled', async () => {
    const mockHandler = jest.fn();
    const { getByRole } = render(
      <Button disabled onClick={mockHandler}>
        Disabled
      </Button>,
    );

    await userEvent.click(getByRole('button'));
    expect(mockHandler).not.toHaveBeenCalled();
    expect(mockHandler).toHaveBeenCalledTimes(0);
    expect(getByRole('button')).toBeDisabled();
    expect(getByRole('button')).toHaveClass('cursor-not-allowed');
  });

  it('should render fill outline style correctly', () => {
    const { getByRole } = render(
      <Button outline={true} fill={true}>
        Hello
      </Button>,
    );

    expect(getByRole('button')).toHaveClass('bg-transparent w-full');
  });

  it('should render danger outline button correctly', () => {
    const { getByRole } = render(
      <DangerButton outline={true} fill={false}>
        Danger
      </DangerButton>,
    );

    expect(getByRole('button')).toHaveClass('bg-transparent');
    expect(getByRole('button')).not.toHaveClass('w-full');
  });

  it('should have type submit', () => {
    const { getByRole } = render(<Button type="submit">Hello</Button>);

    expect(getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('should have type reset', () => {
    const { getByRole } = render(<Button type="reset">Hello</Button>);

    expect(getByRole('button')).toHaveAttribute('type', 'reset');
  });
});
