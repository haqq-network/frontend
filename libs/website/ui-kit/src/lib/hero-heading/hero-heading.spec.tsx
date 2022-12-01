import { render } from '@testing-library/react';

import HeroHeading from './hero-heading';

describe('HeroHeading', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<HeroHeading />);
    expect(baseElement).toBeTruthy();
  });
});
