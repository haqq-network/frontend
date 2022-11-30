import { render } from '@testing-library/react';
import { Alert } from './alert';

describe('Alert', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Alert title="title" text="text" />);
    expect(baseElement).toBeTruthy();
  });
});
