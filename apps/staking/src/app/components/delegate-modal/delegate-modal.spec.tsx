import { render } from '@testing-library/react';

import { DelegateModal } from './delegate-modal';

describe('DelegateModal', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DelegateModal />);
    expect(baseElement).toBeTruthy();
  });
});
