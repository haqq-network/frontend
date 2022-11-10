import { render } from '@testing-library/react';

import ValidatorStatus from './validator-status';

describe('ValidatorStatus', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ValidatorStatus />);
    expect(baseElement).toBeTruthy();
  });
});
