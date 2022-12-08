import { render } from '@testing-library/react';

import SuccessMessageModal from './success-message-modal';

describe('SuccessMessageModal', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SuccessMessageModal />);
    expect(baseElement).toBeTruthy();
  });
});
