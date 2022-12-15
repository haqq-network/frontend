import { render } from '@testing-library/react';

import BurgerMenu from './burger-menu';

describe('BurgerMenu', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BurgerMenu />);
    expect(baseElement).toBeTruthy();
  });
});
