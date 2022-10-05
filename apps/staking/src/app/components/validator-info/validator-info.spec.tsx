import { render } from '@testing-library/react';

import ValidatorInfo from './validator-info';

describe('ValidatorInfo', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ValidatorInfo />);
    expect(baseElement).toBeTruthy();
  });
});
