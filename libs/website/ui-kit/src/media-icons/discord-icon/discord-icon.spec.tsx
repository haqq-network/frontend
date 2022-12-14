import { render } from '@testing-library/react';

import DiscordIcon from './discord-icon';

describe('DiscordIcon', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DiscordIcon />);
    expect(baseElement).toBeTruthy();
  });
});
