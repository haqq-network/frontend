import { render } from '@testing-library/react';

import { DevelopersBlock } from './developers-block';

describe('PartnershipBlock', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DevelopersBlock />);
    expect(baseElement).toBeTruthy();
  });
});
