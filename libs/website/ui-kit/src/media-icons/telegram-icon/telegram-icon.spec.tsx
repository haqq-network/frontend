import { render } from '@testing-library/react';

import TelegramIcon from './telegram-icon';

describe('TelegramIcon', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TelegramIcon />);
    expect(baseElement).toBeTruthy();
  });
});
