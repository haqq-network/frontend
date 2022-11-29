import { render } from '@testing-library/react';

import { PulseLoader, SpinnerLoader } from './loaders';

describe('PulseLoader', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PulseLoader />);
    expect(baseElement).toBeTruthy();
  });
});

describe('SpinnerLoader', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SpinnerLoader />);
    expect(baseElement).toBeTruthy();
  });
});
