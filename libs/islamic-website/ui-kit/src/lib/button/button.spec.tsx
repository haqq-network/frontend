import { render } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('should render successfully', () => {
    const buttonText = 'Test button';
    const { baseElement, getByText } = render(<Button>{buttonText}</Button>);
    expect(baseElement).toBeTruthy();
    expect(getByText(buttonText)).toBeTruthy();
  });
});
