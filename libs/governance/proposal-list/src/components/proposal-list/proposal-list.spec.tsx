import { render } from '@testing-library/react';
import { ProposalList } from './proposal-list';

describe('ProposalList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ProposalList />);
    expect(baseElement).toBeTruthy();
  });
});
