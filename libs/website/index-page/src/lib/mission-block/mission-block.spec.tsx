import { render } from '@testing-library/react';

import MissionBlock from './mission-block';

describe('MissionBlock', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MissionBlock />);
    expect(baseElement).toBeTruthy();
  });
});
