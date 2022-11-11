import { render } from '@testing-library/react';

import BridgeWidget from './bridge-widget';

describe('BridgeWidget', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BridgeWidget />);
    expect(baseElement).toBeTruthy();
  });
});
