import { render } from '@testing-library/react';

import ProposalListCard from './proposal-list-card';

describe('ProposalListCard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ProposalListCard />);
    expect(baseElement).toBeTruthy();
  });
});
