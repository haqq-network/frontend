import { render } from '@testing-library/react';

import DelegationInfo from './delegation-info';

describe('DelegationInfo', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DelegationInfo />);
    expect(baseElement).toBeTruthy();
  });
});
