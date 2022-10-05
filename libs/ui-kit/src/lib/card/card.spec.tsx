import { render } from '@testing-library/react';
import { Card } from './card';

describe('Card', () => {
  it('should render successfully', () => {
    const { queryByText } = render(<Card>Card content</Card>);
    expect(queryByText('Card content')).toBeTruthy();
  });
});
