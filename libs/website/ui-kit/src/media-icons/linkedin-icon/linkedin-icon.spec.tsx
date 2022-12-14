import { render } from '@testing-library/react';

import LinkedinIcon from './linkedin-icon';

describe('LinkedinIcon', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LinkedinIcon />);
    expect(baseElement).toBeTruthy();
  });
});
