import { render } from '@testing-library/react';

import ProposalDetails from './proposal-details';

describe('ProposalDetails', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ProposalDetails />);
    expect(baseElement).toBeTruthy();
  });
});
