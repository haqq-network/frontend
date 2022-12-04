import { render } from '@testing-library/react';

import PartnershipBlock from './partnership-block';

describe('PartnershipBlock', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PartnershipBlock />);
    expect(baseElement).toBeTruthy();
  });
});
