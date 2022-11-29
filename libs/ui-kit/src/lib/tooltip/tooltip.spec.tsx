import { render } from '@testing-library/react';
import { Tooltip } from './tooltip';

describe('Tooltip', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Tooltip text="text">Tooltip</Tooltip>);
    expect(baseElement).toBeTruthy();
  });
});
