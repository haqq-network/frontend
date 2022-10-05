import { render } from '@testing-library/react';

import ValidatorsList from './validators-list';

describe('ValidatorsList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ValidatorsList />);
    expect(baseElement).toBeTruthy();
  });
});
