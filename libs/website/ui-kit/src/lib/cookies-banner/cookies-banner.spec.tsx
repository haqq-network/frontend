import { render } from '@testing-library/react';

import CookiesBanner from './cookies-banner';

describe('CookiesBanner', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CookiesBanner />);
    expect(baseElement).toBeTruthy();
  });
});
