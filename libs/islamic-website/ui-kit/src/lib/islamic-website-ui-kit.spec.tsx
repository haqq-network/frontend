import { render } from '@testing-library/react';

import IslamicWebsiteUiKit from './islamic-website-ui-kit';

describe('IslamicWebsiteUiKit', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<IslamicWebsiteUiKit />);
    expect(baseElement).toBeTruthy();
  });
});
