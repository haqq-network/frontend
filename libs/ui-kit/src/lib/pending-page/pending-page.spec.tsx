import { render } from '@testing-library/react';

import PendingPage from './pending-page';

describe('PendingPage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PendingPage />);
    expect(baseElement).toBeTruthy();
  });
});
