import { render } from '@testing-library/react';

import ValidatorListItem from './validator-list-item';

describe('ValidatorListItem', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ValidatorListItem />);
    expect(baseElement).toBeTruthy();
  });
});
