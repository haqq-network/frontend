import { render } from '@testing-library/react';

import MaxBalanceButton from './max-balance-button';

describe('MaxBalanceButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MaxBalanceButton />);
    expect(baseElement).toBeTruthy();
  });
});
