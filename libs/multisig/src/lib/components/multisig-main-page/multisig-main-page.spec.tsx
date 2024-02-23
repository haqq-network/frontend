import { render } from '@testing-library/react';
import { MultisigMainPage } from './multisig-main-page';

describe('Multisig', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MultisigMainPage />);
    expect(baseElement).toBeTruthy();
  });
});
