import { render } from '@testing-library/react';

import VoteModal from './vote-modal';

describe('VoteModal', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<VoteModal />);
    expect(baseElement).toBeTruthy();
  });
});
