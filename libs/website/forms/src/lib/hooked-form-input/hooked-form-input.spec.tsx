import { render } from '@testing-library/react';

import HookedFormInput from './hooked-form-input';

describe('HookedFormInput', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<HookedFormInput />);
    expect(baseElement).toBeTruthy();
  });
});
