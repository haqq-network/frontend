import { render } from '@testing-library/react';

import Textarea from './textarea';

describe('Textarea', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Textarea />);
    expect(baseElement).toBeTruthy();
  });
});
