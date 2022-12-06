import { render } from '@testing-library/react';

import ScrollButton from './arrow-button';

describe('ScrollButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ScrollButton />);
    expect(baseElement).toBeTruthy();
  });
});
