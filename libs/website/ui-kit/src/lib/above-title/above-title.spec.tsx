import { render } from '@testing-library/react';

import AboveTitle from './above-title';

describe('AboveTitle', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AboveTitle />);
    expect(baseElement).toBeTruthy();
  });
});
