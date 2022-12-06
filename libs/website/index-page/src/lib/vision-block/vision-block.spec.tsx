import { render } from '@testing-library/react';

import VisionBlock from './vision-block';

describe('VisionBlock', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<VisionBlock />);
    expect(baseElement).toBeTruthy();
  });
});
