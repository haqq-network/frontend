import { render } from '@testing-library/react';

import UndelegateModal from './undelegate-modal';

describe('UndelegateModal', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UndelegateModal />);
    expect(baseElement).toBeTruthy();
  });
});
