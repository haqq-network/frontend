import { render } from '@testing-library/react';

import YoutubeIcon from './youtube-icon';

describe('YoutubeIcon', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<YoutubeIcon />);
    expect(baseElement).toBeTruthy();
  });
});
