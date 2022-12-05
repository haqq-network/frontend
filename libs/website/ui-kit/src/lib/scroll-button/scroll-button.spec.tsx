import { render } from '@testing-library/react';

import ScrollButton from './scroll-button';

describe('ScrollButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ScrollButton />);
    expect(baseElement).toBeTruthy();
  });
});
