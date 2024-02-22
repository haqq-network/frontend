import { render } from '@testing-library/react';
import Multisig from './multisig';

describe('Multisig', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Multisig />);
    expect(baseElement).toBeTruthy();
  });
});
