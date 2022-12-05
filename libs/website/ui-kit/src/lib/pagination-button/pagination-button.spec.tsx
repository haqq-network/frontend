import { render } from '@testing-library/react';

import PaginationButton from './pagination-button';

describe('PaginationButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PaginationButton />);
    expect(baseElement).toBeTruthy();
  });
});
