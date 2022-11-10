import { render } from '@testing-library/react';

import RewardsInfo from './rewards-info';

describe('RewardsInfo', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<RewardsInfo />);
    expect(baseElement).toBeTruthy();
  });
});
