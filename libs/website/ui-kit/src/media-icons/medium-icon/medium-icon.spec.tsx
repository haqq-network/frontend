import { render } from '@testing-library/react';

import MediumIcon from './medium-icon';

describe('MediumIcon', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MediumIcon />);
    expect(baseElement).toBeTruthy();
  });
});
