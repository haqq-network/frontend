import { render } from '@testing-library/react';

import TransactionDetails from './transaction-details';

describe('TransactionDetails', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TransactionDetails />);
    expect(baseElement).toBeTruthy();
  });
});
