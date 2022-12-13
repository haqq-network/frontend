import { render } from '@testing-library/react';

import FailureMessageModal from './failure-message-modal';

describe('FailureMessageModal', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FailureMessageModal />);
    expect(baseElement).toBeTruthy();
  });
});
