import { render } from '@testing-library/react';

import ContactBlock from './contact-block';

describe('ContactBlock', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ContactBlock />);
    expect(baseElement).toBeTruthy();
  });
});
