import { render } from '@testing-library/react';

import TwitterIcon from './twitter-icon';

describe('TwitterIcon', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TwitterIcon />);
    expect(baseElement).toBeTruthy();
  });
});
