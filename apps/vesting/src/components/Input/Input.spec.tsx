import '@testing-library/jest-dom';
import { getByText, render } from '@testing-library/react';
import { Input } from './Input';
import { isAddress } from 'ethers/lib/utils';

describe('<Input />', () => {
  beforeEach(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(42);
  });

  afterEach(() => {
    jest.spyOn(global.Math, 'random').mockRestore();
  });

  it('should have correct placeholder, id and label', () => {
    const { container, getByPlaceholderText } = render(
      <Input label="label" id="id" placeholder="placeholder" />,
    );

    const renderedLabel = container.querySelector('label');
    const renderedInput = getByPlaceholderText('placeholder');

    expect(renderedLabel).toBeTruthy();
    expect(renderedLabel).toHaveAttribute('for', 'id');
    expect(renderedInput).toBeTruthy();
    expect(renderedInput).toHaveAttribute('id', 'id');
  });

  it('should have correct ids for label when id is not presented', () => {
    const { container, getByPlaceholderText } = render(
      <Input label="label" placeholder="placeholder" />,
    );

    const renderedLabel = container.querySelector('label');
    const renderedInput = getByPlaceholderText('placeholder');

    expect(renderedLabel).toBeTruthy();
    expect(renderedLabel).toHaveAttribute('for', 'input-42');
    expect(renderedInput).toBeTruthy();
    expect(renderedInput).toHaveAttribute('id', 'input-42');
  });

  it('should have render correctly with success state, value type number and required', () => {
    const { getByDisplayValue } = render(
      <Input state="success" type="number" value={1} required />,
    );
    const renderedInput = getByDisplayValue(1);

    expect(renderedInput).toBeTruthy();
    expect(renderedInput).not.toBe(null);
    expect(renderedInput).toHaveClass('border-primary');
    expect(renderedInput).toHaveValue(1);
    expect(renderedInput).toHaveDisplayValue(/^\d*\.?\d*$/);
    expect(renderedInput).toHaveAttribute('required');
    expect(renderedInput).toHaveAttribute('type', 'number');
  });

  it('should render correctly with error state, hint and value type text', () => {
    const { container, getByDisplayValue } = render(
      <Input
        state="error"
        type="text"
        value={'0x9a1FAb7FEd0b06045aAbEA2D1da73611F6DA2B07'}
        hint="Error"
      />,
    );
    const renderedHint = getByText(container, 'Error');
    const renderedInput = getByDisplayValue(
      '0x9a1FAb7FEd0b06045aAbEA2D1da73611F6DA2B07',
    );

    expect(renderedInput).toBeTruthy();
    expect(renderedInput).not.toBe(null);
    expect(renderedInput).toHaveClass('border-danger');
    expect(renderedInput).toHaveValue(
      '0x9a1FAb7FEd0b06045aAbEA2D1da73611F6DA2B07',
    );
    expect(renderedInput).toHaveDisplayValue(/^0x[a-fA-F0-9]{40}$/);
    expect(renderedInput).toHaveAttribute('type', 'text');
    expect(renderedHint).toBeTruthy();
    expect(renderedHint).not.toBeNull();
    expect(renderedHint).toHaveTextContent('Error');
  });

  it('should render correctly when disabled with placeholder and label', () => {
    const { container, getByPlaceholderText } = render(
      <Input disabled={true} placeholder="placeholder" label="label" />,
    );
    const renderedInput = getByPlaceholderText('placeholder');
    const renderedLabel = container.querySelector('label');

    expect(renderedInput).toBeTruthy();
    expect(renderedInput).not.toBeNull();
    expect(renderedInput).toBeDisabled();
    expect(renderedInput).toHaveAttribute('disabled');
    expect(renderedInput).toHaveClass('cursor-not-allowed');
    expect(renderedInput).toHaveAttribute('placeholder');
    expect(renderedLabel).toBeTruthy();
    expect(renderedLabel).not.toBeNull();
    expect(renderedLabel).toHaveTextContent('label');
  });
});
