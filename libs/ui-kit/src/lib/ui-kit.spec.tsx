import { render } from '@testing-library/react';

import UiKit from './ui-kit';

describe('UiKit', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UiKit />);
    expect(baseElement).toBeTruthy();
  });
});
