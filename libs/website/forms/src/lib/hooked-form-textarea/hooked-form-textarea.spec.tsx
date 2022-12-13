import { render } from '@testing-library/react';

import HookedFormTextarea from './hooked-form-textarea';

describe('HookedFormTextarea', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<HookedFormTextarea />);
    expect(baseElement).toBeTruthy();
  });
});
