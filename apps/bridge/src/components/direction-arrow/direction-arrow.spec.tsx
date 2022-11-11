import { render } from '@testing-library/react';

import DirectionArrow from './direction-arrow';

describe('DirectionArrow', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DirectionArrow />);
    expect(baseElement).toBeTruthy();
  });
});
