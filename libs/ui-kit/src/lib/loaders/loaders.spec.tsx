import { render } from '@testing-library/react';

import Loaders from './loaders';

describe('Loaders', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Loaders />);
    expect(baseElement).toBeTruthy();
  });
});
