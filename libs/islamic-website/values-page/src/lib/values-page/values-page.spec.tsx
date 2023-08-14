import { render } from '@testing-library/react';

import { ValuesPage } from './values-page';

describe('ValuesPage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ValuesPage />);
    expect(baseElement).toBeTruthy();
  });
});
